import React from 'react'

import './App.css';

import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchResults: [],
            playlistName:"Neu PlayList",
            playListTracks: []
        }
        this.addTrack = this.addTrack.bind(this)
        this.removeTrack = this.removeTrack.bind(this)
        this.updatePlaylistName = this.updatePlaylistName.bind(this)
        this.savePlaylist = this.savePlaylist.bind(this)
        this.search = this.search.bind(this)
    }
    
    addTrack(track) {
        if (this.state.playListTracks.find(savedTrack => savedTrack.id === track.id)) {
          return;
        }
        this.state.playListTracks.push(track)
        this.setState({playListTracks: this.state.playListTracks})
    }
    
    removeTrack(track) {
        this.state.playListTracks = this.state.playListTracks.filter(e=>e.id!==track.id)
        
        this.setState({playListTracks: this.state.playListTracks})
    }
    
    updatePlaylistName (name) {
        this.setState({playlistName:name})
    }
    
    savePlaylist() {
        const trackURIS = this.state.playListTracks.map(e=>e.uri)
        Spotify.savePlaylist(this.state.playlistName,trackURIS).then(() => {this.setState({playlistname:'Neu PlayList',playListTracks:[]})})
    }
    
    search(term) {
        Spotify.search(term).then(e=>{
            this.setState({searchResults:e})
        })
    }
    
    render()  {
        return (
       <div>
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch={this.search}/>
            <div className="App-playlist">
                <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
                <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} playlistname={this.state.playlistName} playListTracks={this.state.playListTracks} onRemove={this.removeTrack}/>
            </div>
          </div>
        </div>
      );
    }
}

export default App;
