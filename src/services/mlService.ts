import * as tf from '@tensorflow/tfjs';
import { DELANEY_DATASET, ChemDataPoint } from '../data/chemDataset';

export interface TrainingProgress {
  epoch: number;
  loss: number;
}

export class MLMolecularService {
  private model: tf.Sequential | null = null;
  private isTraining = false;

  // Simple heuristic SMILES descriptor extractor
  public extractDescriptors(smiles: string): number[] {
    const s = smiles.toUpperCase();
    const mw = (s.match(/C/g)?.length || 0) * 12 + 
               (s.match(/O/g)?.length || 0) * 16 + 
               (s.match(/N/g)?.length || 0) * 14 + 
               (s.match(/CL/g)?.length || 0) * 35.5;
    
    const hbd = (s.match(/OH/g)?.length || 0) + (s.match(/NH/g)?.length || 0);
    const hba = (s.match(/O/g)?.length || 0) + (s.match(/N/g)?.length || 0);
    const rotatableBonds = (s.match(/-/g)?.length || 0) + (s.match(/\(/g)?.length || 0);
    const aromaticRings = (s.match(/[a-z]/g)?.length || 0) > 0 ? 1 : (s.match(/c/g)?.length || 0) > 0 ? 1 : 0;

    // Feature normalization (simple scaling)
    return [
      mw / 500,
      hbd / 10,
      hba / 10,
      rotatableBonds / 20,
      aromaticRings / 5
    ];
  }

  public async train(onProgress: (p: TrainingProgress) => void) {
    if (this.isTraining) return;
    this.isTraining = true;

    // 1. Prepare Data
    const inputs: number[][] = DELANEY_DATASET.map(d => this.extractDescriptors(d.smiles));
    const outputs: number[] = DELANEY_DATASET.map(d => d.logS);

    const inputTensor = tf.tensor2d(inputs);
    const outputTensor = tf.tensor2d(outputs, [outputs.length, 1]);

    // 2. Define Model
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [5] }));
    this.model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    this.model.add(tf.layers.dense({ units: 1, activation: 'linear' }));

    this.model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError'
    });

    // 3. Run Training
    await this.model.fit(inputTensor, outputTensor, {
      epochs: 50,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          onProgress({ epoch, loss: logs?.loss || 0 });
        }
      }
    });

    this.isTraining = false;
  }

  public predict(smiles: string): number | null {
    if (!this.model) return null;
    
    const input = [this.extractDescriptors(smiles)];
    const inputTensor = tf.tensor2d(input);
    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const value = prediction.dataSync()[0];
    
    return value;
  }
}

export const mlService = new MLMolecularService();
