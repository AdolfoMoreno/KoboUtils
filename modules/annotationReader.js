import { promises as fs } from 'fs';
import path from 'path';
  
async function readAnnotations(koboDirectory) {  
  const annotationsFile = path.join(koboDirectory, 'annotations.json');  
  try {  
    const fileContent = await fs.readFile(annotationsFile, 'utf8');  
    const annotations = JSON.parse(fileContent);  
    if (!Array.isArray(annotations)) {  
      throw new Error('Annotations file is not formatted correctly');  
    }  
    return annotations;  
  } catch (error) {  
    console.error('Error reading or parsing annotations file:', error);  
    // Fallback to simulated data if needed  
    return [  
      { book: 'Fallback Book 1', chapter: 'Chapter 1', note: 'Fallback note 1' },  
      { book: 'Fallback Book 2', chapter: 'Chapter 2', note: 'Fallback note 2' }  
    ];  
  }  
}  
  
module.exports = { readAnnotations }; 