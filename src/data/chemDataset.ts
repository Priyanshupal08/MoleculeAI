export interface ChemDataPoint {
  smiles: string;
  logS: number; // Log solubility in mol/L
  mw: number;   // Molecular Weight
  hbd: number;  // Hydrogen Bond Donors
  hba: number;  // Hydrogen Bond Acceptors
  rotatableBonds: number;
  aromaticRings: number;
}

// A subset of the Delaney (ESOL) dataset for training
export const DELANEY_DATASET: ChemDataPoint[] = [
  { smiles: "OCC3OC(OCC2OC(OC(C1OC(CO)C(O)C(O)C1O)C2(O)CO)C(O)C(O)C2O)C(O)C(O)C3O", logS: -1.1, mw: 504.4, hbd: 11, hba: 22, rotatableBonds: 9, aromaticRings: 0 },
  { smiles: "n1c2ccccc2nc1c3ccccc3", logS: -4.06, mw: 206.2, hbd: 0, hba: 2, rotatableBonds: 1, aromaticRings: 3 },
  { smiles: "Cc1cc(C)c2cc(C)c(C)cc2c1", logS: -5.42, mw: 206.3, hbd: 0, hba: 0, rotatableBonds: 0, aromaticRings: 2 },
  { smiles: "C1cc(C1)C", logS: -1.82, mw: 70.1, hbd: 0, hba: 0, rotatableBonds: 0, aromaticRings: 0 },
  { smiles: "C1ccc(cc1)Cl", logS: -2.71, mw: 112.6, hbd: 0, hba: 0, rotatableBonds: 0, aromaticRings: 1 },
  { smiles: "c1ccc2c(c1)ccc3c2ccc4c3ccc5c4cccc5", logS: -8.84, mw: 302.4, hbd: 0, hba: 0, rotatableBonds: 0, aromaticRings: 6 },
  { smiles: "O=c1oc2ccccc2cc1C3CC3", logS: -3.81, mw: 186.2, hbd: 0, hba: 2, rotatableBonds: 1, aromaticRings: 2 },
  { smiles: "CC(C)N(C(C)C)C(=O)SCl", logS: -2.3, mw: 193.7, hbd: 0, hba: 1, rotatableBonds: 3, aromaticRings: 0 },
  { smiles: "c1cccc2c1cc3ccccc3c2", logS: -5.13, mw: 178.2, hbd: 0, hba: 0, rotatableBonds: 0, aromaticRings: 3 },
  { smiles: "ClC1=C(Cl)C(Cl)(C(=C1Cl)Cl)C2(Cl)C(=C(Cl)C(Cl)(C2(Cl)Cl)Cl)Cl", logS: -8.27, mw: 545.5, hbd: 0, hba: 0, rotatableBonds: 0, aromaticRings: 0 },
  { smiles: "CN(C)C(=O)SCCC(C)C", logS: -1.8, mw: 173.3, hbd: 0, hba: 1, rotatableBonds: 4, aromaticRings: 0 },
  { smiles: "O=C(O)c1ccccc1", logS: -1.58, mw: 122.1, hbd: 1, hba: 2, rotatableBonds: 1, aromaticRings: 1 },
  { smiles: "Cc1ccccc1", logS: -2.25, mw: 92.1, hbd: 0, hba: 0, rotatableBonds: 1, aromaticRings: 1 },
  { smiles: "CCCC", logS: -2.61, mw: 58.1, hbd: 0, hba: 0, rotatableBonds: 1, aromaticRings: 0 },
  { smiles: "Cc1ccccc1C", logS: -2.62, mw: 106.2, hbd: 0, hba: 0, rotatableBonds: 2, aromaticRings: 1 },
  { smiles: "c1cc(c(cc1C(F)(F)F)Cl)N", logS: -2.57, mw: 195.6, hbd: 2, hba: 1, rotatableBonds: 1, aromaticRings: 1 },
  { smiles: "O=C(N(C)C)Nc1ccc(Cl)cc1", logS: -2.39, mw: 198.7, hbd: 1, hba: 1, rotatableBonds: 1, aromaticRings: 1 },
  { smiles: "CCCCCCCCCl", logS: -4.8, mw: 148.7, hbd: 0, hba: 0, rotatableBonds: 7, aromaticRings: 0 },
  { smiles: "c1cc2c(cc1)ccc3c2ccc4c3cccc4", logS: -6.44, mw: 228.3, hbd: 0, hba: 0, rotatableBonds: 0, aromaticRings: 4 },
  { smiles: "CC1(C)CC(NC(C1)C)(C)C", logS: -0.73, mw: 155.3, hbd: 1, hba: 1, rotatableBonds: 0, aromaticRings: 0 },
  { smiles: "NC(=O)c1ccccc1", logS: -1.3, mw: 121.1, hbd: 2, hba: 1, rotatableBonds: 1, aromaticRings: 1 },
  { smiles: "CCCCCO", logS: -0.66, mw: 102.2, hbd: 1, hba: 1, rotatableBonds: 4, aromaticRings: 0 },
  { smiles: "CC(C)CC(C)O", logS: -0.52, mw: 102.2, hbd: 1, hba: 1, rotatableBonds: 2, aromaticRings: 0 },
  { smiles: "CO", logS: 1.58, mw: 32.0, hbd: 1, hba: 1, rotatableBonds: 0, aromaticRings: 0 },
  { smiles: "CCCl", logS: -1.2, mw: 64.5, hbd: 0, hba: 0, rotatableBonds: 0, aromaticRings: 0 },
  { smiles: "CC(C)=O", logS: 1.24, mw: 58.1, hbd: 0, hba: 1, rotatableBonds: 0, aromaticRings: 0 },
  { smiles: "CC#N", logS: 1.3, mw: 41.1, hbd: 0, hba: 1, rotatableBonds: 0, aromaticRings: 0 },
  { smiles: "CCN(CC)C(=O)c1ccccc1", logS: -0.9, mw: 177.2, hbd: 0, hba: 1, rotatableBonds: 3, aromaticRings: 1 },
  { smiles: "c1ccc(cc1)Cl", logS: -2.71, mw: 112.6, hbd: 0, hba: 0, rotatableBonds: 0, aromaticRings: 1 },
  { smiles: "c1cc(cc(c1)Cl)Cl", logS: -3.5, mw: 147.0, hbd: 0, hba: 0, rotatableBonds: 0, aromaticRings: 1 },
  { smiles: "c1c(cc(c(c1Cl)Cl)Cl)Cl", logS: -4.3, mw: 181.4, hbd: 0, hba: 0, rotatableBonds: 0, aromaticRings: 1 },
  { smiles: "CC(=O)Oc1ccccc1C(=O)O", logS: -1.5, mw: 180.2, hbd: 1, hba: 4, rotatableBonds: 3, aromaticRings: 1 },
  { smiles: "CN(C)C(=O)Oc1cc(C)c(C)c(C)c1", logS: -2.6, mw: 207.3, hbd: 0, hba: 2, rotatableBonds: 1, aromaticRings: 1 },
  { smiles: "CC[C@H](C)C", logS: -2.6, mw: 72.2, hbd: 0, hba: 0, rotatableBonds: 1, aromaticRings: 0 },
];
