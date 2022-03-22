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
const {width, height} = Dimensions.get('window');

const setupPlayer = async () => {
  try {
      await TrackPlayer.setupPlayer()
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
  const scrollX = useRef(new Animated.Value(0)).current;


  const playBackState=usePlaybackState();

  useEffect(() => {
      setupPlayer()
    scrollX.addListener(({value}) => {
      console.log(value);
      const index = Math.round(value / width);
      setSongIndex(index);
    });
  }, []);

  //Songs Flatlist render
  const songsRender = ({item, index}) => {
    return (
      <Animated.View style={styles.mainImageWrapper}>
        <View style={[styles.imageWrapper, styles.elevation]}>
          <Image source={item.artwork} style={styles.musicImage} />
        </View>
      </Animated.View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* image */}

        <Animated.FlatList
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
          <Text style={styles.songTitle}>{songs[songIndex].title}</Text>
          <Text style={styles.songArtist}>{songs[songIndex].artist}</Text>
        </View>
        {/* slider */}

        <View>
          <Slider
            style={styles.progressBar}
            value={10}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#FFD369"
            thumbTintColor="#FFD369"
            onSlidingComplete={() => {}}
          />
        </View>
        {/* music progress duraions */}

        <View style={styles.progressLevelDuration}>
          <Text style={styles.progressLabelText}>00:00</Text>
          <Text style={styles.progressLabelText}>00:00</Text>
        </View>
        {/* music controls */}
        <View style={styles.musicControlContainer}>
          <TouchableOpacity>
            <IonIcons name="play-skip-back-outline" size={30} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>tooglePlayBack(playBackState)}>
            <IonIcons name={playBackState===State.Playing?"ios-pause-circle":"ios-play-circle"} size={70} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity>
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
          <TouchableOpacity>
            <IonIcons name="repeat" size={30} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity>
            <IonIcons name="share-outline" size={30} color="#888" />
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
