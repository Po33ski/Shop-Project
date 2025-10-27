import { useRef, useState } from 'react';
import styles from './ImageUpload.module.css';

export function ImageUpload({ 
  name = 'photos',
  accept = 'image/jpeg,image/jpg',
  multiple = true,
  onChange,
  existingPhotos = [],
  children 
}) {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [removedPhotos, setRemovedPhotos] = useState([]);

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    if (onChange) {
      onChange(e);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    // Update the file input
    const dt = new DataTransfer();
    newFiles.forEach(file => dt.items.add(file));
    fileInputRef.current.files = dt.files;
    
    // Trigger onChange with updated files
    if (onChange) {
      const event = {
        target: {
          files: dt.files,
          name: name
        }
      };
      onChange(event);
    }
  };

  const removeExistingPhoto = (index) => {
    const photoToRemove = existingPhotos[index];
    setRemovedPhotos(prev => [...prev, photoToRemove]);
    
    // Trigger onChange to notify parent
    if (onChange) {
      const event = {
        target: {
          files: fileInputRef.current?.files || new DataTransfer().files,
          name: name,
          removedPhotos: [...removedPhotos, photoToRemove]
        }
      };
      onChange(event);
    }
  };

  return (
    <div className={styles.imageUpload}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        name={name}
        className={styles.fileInput}
        onChange={handleFileChange}
      />
      <div 
        className={styles.uploadArea}
        onClick={handleAreaClick}
      >
        {children || '📷 Kliknij aby wybrać zdjęcia (JPG)'}
      </div>
      
      {/* Existing Photos */}
      {existingPhotos.length > 0 && (
        <div className={styles.existingPhotos}>
          <h4>Obecne zdjęcia:</h4>
          <div className={styles.photosGrid}>
            {existingPhotos.map((photo, index) => (
              <div key={index} className={styles.photoItem}>
                <img 
                  src={photo} 
                  alt={`Zdjęcie ${index + 1}`}
                  className={styles.photoPreview}
                />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeExistingPhoto(index);
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Files */}
      {selectedFiles.length > 0 && (
        <div className={styles.selectedFiles}>
          <h4>Nowe pliki:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className={styles.fileItem}>
              <span className={styles.fileName}>📄 {file.name}</span>
              <span className={styles.fileSize}>
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
