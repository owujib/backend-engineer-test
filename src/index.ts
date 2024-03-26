import mongoose from 'mongoose';
import app from './app';
import 'dotenv/config';

app.listen(app.get('PORT'), () => {
  console.log('Server is running on %s', app.get('PORT'));
});
