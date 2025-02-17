const { expect } = require('chai');
const path = require('path');
const { readAnnotations } = require('../modules/annotationReader');

describe('Annotation Reader', () => {
    it('should return an array of annotations from a valid JSON file', async () => {
        const sampleDir = path.join(__dirname, '../data-sample');
        const annotations = await readAnnotations(sampleDir);
        expect(annotations).to.be.an('array');
        expect(annotations[0]).to.have.property('book');
        expect(annotations[0]).to.have.property('chapter');
        expect(annotations[0]).to.have.property('note');
    });

    it('should fallback to simulated data if file is missing or invalid', async () => {
        const invalidDir = path.join(__dirname, '../non-existent-dir');
        const annotations = await readAnnotations(invalidDir);
        expect(annotations).to.be.an('array');
    });
}); 