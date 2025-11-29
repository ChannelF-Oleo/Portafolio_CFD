import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid"; // Instala esto: npm install uuid

// Función para subir cualquier archivo
export const uploadFile = async (file, folder) => {
  if (!file) return null;
  const fileName = `${uuidv4()}_${file.name}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};
