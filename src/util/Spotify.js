
/* register a Spotify application and create a method called getAccessToken in the Spotify module. The method will get a user's access token so that they can make requests to the Spotify API.

 */

const url = 'https://accounts.spotify.com/authorize';
const clientId = '';
const responseType = 'token';
const redirectUri = 'http://localhost:3000/';
const scope = 'playlist-modify-public';
let accessToken = '';
const authorizationUrl = `${url}?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}`;


const Spotify = {
    getAccessToken() {
        if(accessToken)
          return accessToken;
        else if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
          let accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
          let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      
          window.setTimeout(() => accessToken = '', expiresIn*1000);
          window.history.pushState('Access Token', null, '/');
      
          return accessToken;
        } else {
          window.location = authorizationUrl;
        }
      },

    search(searchTerm){
        let accessToken = this.getAccessToken();
        console.log(accessToken);
        if(!accessToken){
            console.log('No access token');
            return [];
        }
        return fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=artist,track`, {
            headers: 
                {Authorization: `Bearer ${accessToken}`}
        }).then(
            (response) => {
                return response.json();
            }
        ).then(
            (jsonResponse) => {
                if(jsonResponse.tracks) {
                    return jsonResponse.tracks.items.map(track => (
                         {
                            id: track.id,                            
                            name: track.name,
                            artist: track.artists[0].name,
                            album: track.album.name,
                            uri: track.uri
                        }
                    ))
                } else {
                    return [];
                }
            }
        );
    },

    savePlaylist(playlistName, trackUris){
        if(!playlistName || !trackUris.length){
            return;
        }
        const accessToken = this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        let userId;

        console.log(accessToken);
        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => {
            if (response.ok) {
              return response.json()
            }
            throw new Error('Request Failed!');
          }, networkError => console.log(networkError.message)
        ).then(
            jsonResponse => {
                userId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({name: playlistName})
                }
            ).then(response => {
                    if (response.ok) {
                      return response.json()
                    }
                    throw new Error('Request Failed!');
                  }, networkError => console.log(networkError.message)
            ).then(jsonResponse => {
                        const playlistId = jsonResponse.id;
                        fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({uris: trackUris}
                            )
                        });
                })
            
            }
        )
        }
}


export default Spotify;
