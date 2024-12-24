import React, {useState, useEffect} from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import "./css/Config.css";

const ConfigClassifierDataSampleComponent = ({isClickedShowDataSamples, setIsClickedShowDataSamples,
                                            isOnLoadingShowDataSamples, setIsOnLoadingShowDataSamples,
                                            sampleItems, setSampleItems,
                                            radioCheckedTaskLabel}) => {

    const [alreadyLoadedUuids, setAlreadyLoadedUuids] =useState([]);
    const [imageTexts, setImageTexts] =useState({});
    const [imageUploadDatetimeMap, setImageUploadDatetimeMap] =useState({});
    const [isOnHover, setIsOnHover] =useState(false);
    const [onHoverItemKey, setOnHoverItemKey] =useState("");

    useEffect(async () => {
        if (isClickedShowDataSamples) {
            setIsClickedShowDataSamples(false);
            await fetchFileDownload();
            setIsOnLoadingShowDataSamples(false);
        }
    }, [isClickedShowDataSamples]);

    useEffect(async () => {
        await fetchImageText();
    }, [sampleItems]);

    const cleanseDeletedSampleItem = (uuid) => {
        setSampleItems(sampleItems.filter(sampleItem => sampleItem.uuid !== uuid));
    }
  
    const fetchFileDownload = async () => {
        setIsOnLoadingShowDataSamples(true);
        const response = await fetch("/process/file/download", {
                    method: 'POST',
                    body: JSON.stringify({"taskLabel": radioCheckedTaskLabel,
                                        "uuidsToExclude": alreadyLoadedUuids
                    }),
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
        if (sampleItems.length == 0) {
            return;
        }
        try {
          const response = await fetch("/process/file/text", {
            method: "POST",
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({ "taskLabel": radioCheckedTaskLabel,
                                    "uuids": sampleItems.map(item => item.uuid)
             }),
          });
          const fileTexts = await response.json();
          for (let fileText of fileTexts) {
            setImageTexts((prev) => ({ ...prev, [fileText.uuid+fileText.in_sample_seq_id]: fileText.content }));
            setImageUploadDatetimeMap((prev) => ({ ...prev, [fileText.uuid+fileText.in_sample_seq_id]: fileText.datetime }));
            setAlreadyLoadedUuids((prev) => {
                                    if (prev.includes(fileText.uuid)) {
                                        return prev;
                                    } else {
                                        return [...prev, fileText.uuid];
                                    }
                                });
          }
        } catch (error) {
          console.error("Error fetchImageText:", error);
        }
    };

    const fetchDeleteImageAndText = (taskLabel, uuid) => {
        try {
            const response = fetch("/process/delete/sample", {
                method: 'POST',
                body: JSON.stringify({"taskLabel": taskLabel,
                                    "uuid": uuid
                }),
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            .then( response => {
                if (response === undefined) {
                    throw new Error("ocr json conversion response is null.");
                } else if (!response.ok) {
                    throw new Error('ocr json conversion response was not ok.');
                }
                return response.json();
            })
            .then( data => {
                if (data.error !== undefined) {
                    console.log(data.error);
                }
                cleanseDeletedSampleItem(uuid);
            })
            .catch((postErr) => {
                // Handle error response
                if (postErr === "") {
                    postErr = "Image Process Error.";
                }
            });
        } catch (error) {
            ;
        } finally {
            ;
        }
    }

    const handleHover = (isThisOnHover, itemKey) => {
        setIsOnHover(isThisOnHover);
        setOnHoverItemKey(itemKey);
    }

  return (
    <div>
      <ul>
        {sampleItems.map((item, index) => {
        if (radioCheckedTaskLabel === item.query_task) return (
          <li key={item.uuid+item.in_sample_seq_id+index}>
            <p>UUID: &#160;&#160; {item.uuid}</p>
            <p>Label: &#160;&#160; {item.query_task}</p>
            <p>Uploaded at: &#160;&#160;
                {imageUploadDatetimeMap[item.uuid+item.in_sample_seq_id] && imageUploadDatetimeMap[item.uuid+item.in_sample_seq_id] }
            </p>
            <div onMouseEnter={(e) => { handleHover(true, item.uuid+item.in_sample_seq_id); }}
                onMouseLeave={(e) => { handleHover(false, item.uuid+item.in_sample_seq_id); }}
                className='data-sample-wrapper'>
                <Image
                    src={`data:image/png;base64,${item.image_base64}`}
                    alt={`UUID-${item.uuid}`}
                    style={{"maxHeight": "30rem",
                            "maxWidth": "30rem"
                    }}
                />
                {onHoverItemKey === item.uuid+item.in_sample_seq_id && isOnHover && (<Button
                    variant="danger" type="submit"
                    onClick={(e) => fetchDeleteImageAndText(radioCheckedTaskLabel, item.uuid)}
                >
                    Delete
                </Button>)}
            </div>
            {imageTexts[item.uuid+item.in_sample_seq_id] && <p>{imageTexts[item.uuid+item.in_sample_seq_id]}</p>}
          </li>
        )})}
      </ul>
    </div>
  );
};

export default ConfigClassifierDataSampleComponent;