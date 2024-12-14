export function parseRawJson(rawJson: string) {
    let artistName = 'Dispopen';
    let frameName = 'Default'
    // Parse the raw JSON string
    const parsedJson = JSON.parse(rawJson);
  
    if(parsedJson.frame != undefined){
           // Extract the artist_name and frame_name
    artistName = parsedJson.frame.artist_name;
    frameName = parsedJson.frame.frame_name;
    }
 
  
    // Return the result as an object
    return { artistName, frameName };
  }