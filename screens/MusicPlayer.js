import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';

import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import songs from '../model/Data';

import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents
} from 'react-native-track-player';
import { useNavigation } from '@react-navigation/native';
const {width, height} = Dimensions.get('window');

const setupPlayer = async () => {
  try {
      await TrackPlayer.setupPlayer()
      await TrackPlayer.updateOptions({
          capabilities:[
              Capability.Play,
              Capability.Pause,
              Capability.SkipToNext,
              Capability.SkipToPrevious,
              Capability.Skip,
              Capability.Stop,
          ]
      })
      await TrackPlayer.add(songs)
  } catch (error) {
    console.log(error);
  }
};

const tooglePlayBack=async (playBackState)=>{
    const currentTrack=TrackPlayer.getCurrentTrack()
    if(currentTrack !==null){
        if(playBackState==State.Paused){
            await TrackPlayer.play()
        }
        else{
            await TrackPlayer.pause()
        }
    }
}

const MusicPlayer = () => {
  const [songIndex, setSongIndex] = useState(0);
  const [trackTitle,setTrackTitle]=useState()
  const [trackArtist,setTrackArtist]=useState()
  const [trackArtWork,setTrackArtWork]=useState()

const navigation=useNavigation()

  const [repeatMode,setRepeatMode]=useState('off')

  const progress=useProgress();

  //custom reference
  const scrollX = useRef(new Animated.Value(0)).current;

  const songSlider=useRef(null)// Faltlist reference


  //changing the track

  useTrackPlayerEvents([Event.PlaybackTrackChanged],async event=>{
      if(event.type===Event.PlaybackTrackChanged && event.nextTrack!== null){
          const track= await TrackPlayer.getTrack(event.nextTrack)
          const {title,artist,artwork}=track;
          setTrackTitle(title)
          setTrackArtist(artist)
          setTrackArtWork(artwork)
      }
  })


  const repeatIcon=()=>{
      if(repeatMode=='off'){
          return 'repeat-off'
      }
      if(repeatMode=='track'){
          return 'repeat-once'
      }
      if(repeatMode=='repeat'){
          return 'repeat'
      }
  }

  const changeRepeatMode=()=>{
    if(repeatMode=='off'){
        TrackPlayer.setRepeatMode(RepeatMode.Track)
       setRepeatMode('track')
    }
    if(repeatMode=='track'){
        TrackPlayer.setRepeatMode(RepeatMode.Queue)
        setRepeatMode('repeat')
    }
    if(repeatMode=='repeat'){
        TrackPlayer.setRepeatMode(RepeatMode.Off)
        setRepeatMode('off')
    }
  }

  const playBackState=usePlaybackState();


  const skipTo=async(trackId)=>{
    await TrackPlayer.skip(trackId)
  }

  useEffect(() => {
      setupPlayer()
    scrollX.addListener(({value}) => {
      console.log(value);
      const index = Math.round(value / width);
      skipTo(index)
      setSongIndex(index);
    });

    return()=>{
        scrollX.removeAllListeners()
        TrackPlayer.destroy()
    }
  }, []);

  //Songs Flatlist render
  const songsRender = ({item, index}) => {
    return (
      <Animated.View style={styles.mainImageWrapper}>
        <View style={[styles.imageWrapper, styles.elevation]}>
          <Image source={trackArtWork} style={styles.musicImage} />
        </View>
      </Animated.View>
    );
  };


  const skipToNext=()=>{

    songSlider.current.scrollToOffset({
        offset:(songIndex+1)*width
    })
  }

  const skipToPrev=()=>{

    songSlider.current.scrollToOffset({
        offset:(songIndex-1)*width
    })
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* image */}

        <Animated.FlatList
          ref={songSlider}
          data={songs}
          renderItem={songsRender}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {x: scrollX},
                },
              },
            ],
            {useNativeDriver: true},
          )}
        />

        {/* song content */}

        <View>
          <Text style={styles.songTitle}>{trackTitle}</Text>
          <Text style={styles.songArtist}>{trackArtist}</Text>
        </View>
        {/* slider */}

        <View>
          <Slider
            style={styles.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#FFD369"
            thumbTintColor="#FFD369"
            onSlidingComplete={async value=>{
                await TrackPlayer.seekTo(value)
            }}
          />
        </View>
        {/* music progress duraions */}

        <View style={styles.progressLevelDuration}>
          <Text style={styles.progressLabelText}>{
              new Date(progress.position*1000).toLocaleTimeString().substring(3)
          }</Text>
          <Text style={styles.progressLabelText}>{
              new Date((progress.duration-progress.position)*1000).toLocaleTimeString().substring(3)
          }</Text>
        </View>
        {/* music controls */}
        <View style={styles.musicControlContainer}>
          <TouchableOpacity onPress={skipToPrev}>
            <IonIcons name="play-skip-back-outline" size={30} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>tooglePlayBack(playBackState)}>
            <IonIcons name={playBackState===State.Playing?"ios-pause-circle":"ios-play-circle"} size={70} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNext}>
            <IonIcons
              name="play-skip-forward-outline"
              size={30}
              color="#FFD369"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomIconWrapper}>
          <TouchableOpacity>
            <IonIcons name="heart-outline" size={30} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity onPress={changeRepeatMode}>
            
            <MaterialCommunityIcons
             name={`${repeatIcon()}`}
              size={30} 
              color={repeatMode !=='off'?'FFD369':'#888'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate('Upload')}>
            <IonIcons name="cloud-upload-outline" size={30} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity>
            <IonIcons name="ellipsis-horizontal" size={30} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MusicPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
    borderTopColor: '#393E46',
    borderWidth: 1,
  },
  bottomIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  mainImageWrapper: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 300,
    height: 350,
    marginBottom: 25,
    marginTop: 50,
  },
  musicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  elevation: {
    elevation: 5,
    shadowColor: '#ccc',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#eee',
    textAlign: 'center',
  },
  songArtist: {
    fontSize: 16,
    fontWeight: '300',
    color: '#eee',
    textAlign: 'center',
  },
  progressBar: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },
  progressLevelDuration: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 340,
  },
  progressLabelText: {
    color: '#fff',
    fontWeight: '500',
  },
  musicControlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%',
    marginTop: 15,
  },
});
