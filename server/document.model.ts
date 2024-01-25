import { Schema, model } from 'mongoose';

const documentSchema = new Schema({
  _id: String,
  data: Object,
}, {
  collection: 'documents',
});

const Document = model('Document', documentSchema);

export default Document;
