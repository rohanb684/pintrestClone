import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueFilename = uuidv4();
      cb(null, uniqueFilename+ path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })

  export default upload;