const clientId = ''
const redirectURI = 'http://okiyi_Jamming.surge.sh'
let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)
        
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1]
            const expiresIn = Number(expiresInMatch[1])
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
            window.location=accessURL
        }
    },
    
    search(term){
        const accessToken = Spotify.getAccessToken()
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
          headers: {Authorization: `Bearer ${accessToken}`}
        })
            .then(response => response.json())
            .then(jsonResponse => !jsonResponse.tracks ? [] : jsonResponse.tracks.items.map( e => ({
                id: e.id,
                name:e.name,
                artist:e.artists[0].name,
                album:e.album.name,
                uri:e.uri }) ))
    },
    savePlaylist(name, trackUris) {
        if (!name || !trackUris) {
            return
        }
        const accessToken = Spotify.getAccessToken()
        const headers = { Authorization: `Bearer ${accessToken}`}
        let userID;
        
        return fetch('https://api.spotify.com/v1/me', {headers: headers})
                .then(response => response.json())
                .then(jsonResponse => { 
                        userID = jsonResponse.id
                        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {headers: headers, method: "POST",body: JSON.stringify({name:name})})
                        .then(response=>response.json())
                        .then(jsonResponse=>{
                            const playlistID = jsonResponse.id
                            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,{headers:headers,method:"POST",body:JSON.stringify({uris: trackUris})})
                        })
                        }
                     )
    }
}

export default Spotify