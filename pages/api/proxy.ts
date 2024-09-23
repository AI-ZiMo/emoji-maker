import type { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    try {
      const output = await replicate.run(
        "levelsio/san-andreas:61cdb2f6a8f234ea9ca3cce88d5454f9b951f93619f5f353a331407f4a05a314",
        {
          input: {
            model: "dev",
            prompt,
            lora_scale: 1,
            num_outputs: 1,
            aspect_ratio: "16:9",
            output_format: "webp",
            guidance_scale: 3.5,
            output_quality: 90,
            prompt_strength: 0.8,
            extra_lora_scale: 1,
            num_inference_steps: 28
          }
        }
      );
      res.status(200).json({ output });
    } catch (error) {
      console.error('Replicate API error:', error);
      res.status(500).json({ error: 'Failed to generate image', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}