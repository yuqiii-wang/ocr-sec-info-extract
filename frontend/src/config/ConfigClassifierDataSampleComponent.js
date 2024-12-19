import React, {useState, useEffect} from 'react';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import "./css/Config.css";

const ConfigClassifierDataSampleComponent = ({isClickedShowDataSamples, setIsClickedShowDataSamples,
                                            isOnLoadingShowDataSamples, setIsOnLoadingShowDataSamples,
                                            sampleItems, setSampleItems,
                                            radioCheckedTaskLabel}) => {

    const [imageTexts, setImageTexts] =useState({});

    useEffect(async () => {
        if (isClickedShowDataSamples) {
            setSampleItems([]);
            setImageTexts({});
            setIsClickedShowDataSamples(false);
            await fetchFileDownload();
            setIsOnLoadingShowDataSamples(false);
        }
    }, [isClickedShowDataSamples]);

    useEffect(async () => {
        await fetchImageText();
    }, [sampleItems]);
  
    const fetchFileDownload = async () => {
        setIsOnLoadingShowDataSamples(true);
        const response = await fetch("/process/file/download", {
                    method: 'POST',
                    body: JSON.stringify({"taskLabel": radioCheckedTaskLabel,}),
                    mode: "cors",
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }),
            });
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = ""; // Buffer to hold incomplete chunks

        const delimiter = "\n---END---\n";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
    
            buffer += decoder.decode(value, { stream: true });
    
            let parts = buffer.split(delimiter);
            buffer = parts.pop(); // Keep the last incomplete part in the buffer
    
            for (const part of parts) {
            try {
                const item = JSON.parse(part);
                setSampleItems((prevItems) => [...prevItems, item]); // Update state incrementally
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
            }
        }
    };

    const fetchImageText = async () => {
        try {
          const response = await fetch("/process/file/text", {
            method: "POST",
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({ "taskLabel": "bbg_bond",
                                    "uuids": sampleItems.map(item => item.uuid)
             }),
          });
          const fileTexts = await response.json();
          for (let fileText of fileTexts) {
            console.log(fileText.uuid);
            setImageTexts((prev) => ({ ...prev, [fileText.uuid+fileText.in_sample_seq_id]: fileText.content }));
          }
        } catch (error) {
          console.error("Error fetching text info:", error);
        }
    };

  return (
    <div>
      <ul>
        {sampleItems.map((item) => (
          <li key={item.uuid+item.in_sample_seq_id}>
            <p>UUID: {item.uuid}</p>
            <img
              src={`data:image/png;base64,${item.image_base64}`}
              alt={`UUID-${item.uuid}`}
              style={{ maxWidth: "300px", maxHeight: "300px" }}
            />
            {imageTexts[item.uuid+item.in_sample_seq_id] && <p>{imageTexts[item.uuid+item.in_sample_seq_id]}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConfigClassifierDataSampleComponent;