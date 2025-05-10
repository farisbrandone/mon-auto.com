import React from "react";
/* 
 {uploadProgress > 0 && uploadProgress < 100 &&
*/
export default function UploadProgressBar({
  uploadProgress,
}: {
  uploadProgress: number;
}) {
  return (
    <div className="progress-bar">
      <div style={{ width: `${uploadProgress}%` }}>{uploadProgress}%</div>
    </div>
  );
}
