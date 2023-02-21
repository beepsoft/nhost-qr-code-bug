import {Request, Response} from 'express';
import {PassThrough} from 'stream';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const QRCode = require("qrcode")

const sleep = time => new Promise(res => setTimeout(res, time, "done sleeping"));

/**
 * Generates QR code to be put in a Location.
 *
 * Query parameters:
 *  - locationId: ID of the location - required
 *  - address: address of location to be included in the code - optional
 *  - description: any free description - optional
 *  - width: width of the generated image, defaults to 400px
 *
 * @param req
 * @param res
 */
export default async (req: Request, res: Response) => {
  try{
    console.log("res", res)
    res.setHeader("content-type", "image/png")
    const locationId = req.query.locationId;
    const address = req.query.address;
    const description = req.query.description;
    const width = req.query.width || 400;

    const content = JSON.stringify({
      locationId,
      address,
      description
    })

    const qrStream = new PassThrough();
    qrStream.setDefaultEncoding('binary')

    await QRCode.toFileStream(qrStream, content,
      {
        type: 'png',
        width: width,
        errorCorrectionLevel: 'H'
      }
    );

    qrStream.pipe(res);

    console.log("before")
    await sleep(2000)
    console.log("after")
  } catch(err){
    console.error('Failed to return content', err);
  }
}

