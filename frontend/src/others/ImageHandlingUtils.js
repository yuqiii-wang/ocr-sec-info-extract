import JSZip from "jszip";

export async function extractResponseImages (referenceResults) {

    const imagesData = [];

    try {
      // Fetch the base64-encoded zip file from the Flask backend

      const data = referenceResults;
      const base64Zip = data.zip_file;

      // Decode the base64 string
      const binaryString = atob(base64Zip);
      const binaryData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        binaryData[i] = binaryString.charCodeAt(i);
      }

      // Unzip the files using JSZip
      const zip = new JSZip();
      const content = await zip.loadAsync(binaryData.buffer);
      const imagePromises = [];

      content.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir && /\.(png|jpe?g|gif|bmp|webp)$/i.test(zipEntry.name)) {
          const promise = zipEntry.async('base64').then((base64) => {
            return {
              src: `data:image/${zipEntry.name.split('.').pop()};base64,${base64}`,
              name: zipEntry.name,
            };
          });
          imagePromises.push(promise);
        }
      });

      const imageResolvedPromises = await Promise.all(imagePromises);
      for (let i = 0; i < imageResolvedPromises.length; i++) {
        imagesData.push(imageResolvedPromises[i])
      }
    } catch (error) {
      console.error('Error fetching or unzipping the files:', error);
    }
    console.log(imagesData);
    return imagesData;
  };