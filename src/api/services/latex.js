import latex from 'node-latex';
import fs from 'fs';
import { file } from 'tmp-promise';
import PDF2Pic from 'pdf2pic';

const latex2pdf = (path, doc) => new Promise((resolve, reject) => {
  const output = fs.createWriteStream(path);
  const pdf = latex(doc);

  pdf.pipe(output);
  pdf.on('error', reject);
  pdf.on('finish', resolve);
});

const pdf2png = async (path) => {
  console.log(path);
  const converter = new PDF2Pic({
    density: 300, // output pixels per inch
    savename: 'untitled', // output file name
    savedir: './', // output file location
    format: 'png', // output file format
    size: 1024, // output size in pixels
  });
  const res = await converter.convertToBase64(path);
  return res.base64;
};

// eslint-disable-next-line import/prefer-default-export
export const latexEotd = async (title, eq) => {
  const doc = `
\\documentclass[notitlepage]{article}

\\usepackage{amsmath}
\\usepackage[paperwidth=3in,paperheight=3.1in,margin=0.05in]{geometry}
\\usepackage[utf8]{inputenc}

\\Large
\\title{Equation of the Day}
\\Large
\\begin{document}
\\maketitle
\\thispagestyle{empty}
\\Large
\\centerline{${title}}
\\Large

\\[ ${eq} \\]

\\end{document}
  `;
  const { path, cleanup } = await file({ postfix: '.pdf' });
  await latex2pdf(path, doc);
  const base64 = await pdf2png(path);
  cleanup();
  // console.log(base64);
  return base64;
};
