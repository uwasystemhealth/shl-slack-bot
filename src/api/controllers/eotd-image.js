import { Eotd } from '../../models';

export default async (req, res) => {
  const eotd = await Eotd.findById(req.params.id);
  if (!eotd) return res.status(404).send('eotd not found');
  const img = Buffer.from(eotd.image, 'base64');
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length,
  });
  return res.end(img);
};
