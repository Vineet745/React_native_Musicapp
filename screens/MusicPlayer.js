import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  FlatList,
  SafeAreaView,
} from 'react-native';

// Tranckplayer

import TrackPlayer, {
  useTrackPlayerEvents,
  usePlaybackState,
  Event,
  State,
  Capability,
  RepeatMode,
  useProgress,
} from 'react-native-track-player';

import Slider from '@react-native-community/slider';
import React, {useRef, useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import songs from '../model/Data';

const {width, height} = Dimensions.get('window');

// setupplayer

const setupplayer = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.add(songs);
};

const togglePlayBack = async playbackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  console.log(currentTrack, playbackState, State.Playing);
  if (currentTrack != null) {
    if (playbackState === State.Paused || playbackState === State.Ready) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};

const MusicPlayer = () => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [songIndex, setsongIndex] = useState(0);
  const songSlider = useRef(null);

  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId);
  };

  // UseEffect Area
  useEffect(() => {
    setupplayer();
    scrollX.addListener(({value}) => {
      const index = Math.round(value / width);
      skipTo(index);
      setsongIndex(index);
    });

    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };

  const skipToPrevious = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  const rendersongs = ({item, index}) => {
    return (
      <View
        style={{width: width, justifyContent: 'center', alignItems: 'center'}}>
        <Animated.View style={style.artworkWrapper}>
          <Image style={style.artworkimage} source={item.artwork}></Image>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.maincontainer}>
        {/* Image */}

        <Animated.FlatList
          ref={songSlider}
          data={songs}
          renderItem={rendersongs}
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

        {/* Title an all */}
        <View style={style.titleWrapper}>
          <Text style={style.title}>{songs[songIndex].title}</Text>
          <Text style={style.Artist}>{songs[songIndex].artist}</Text>
        </View>

        {/* Slider */}
        <View>
          <Slider
            style={style.progresscontainer}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#ffd369"
            minimumTrackTintColor="#ffd369"
            maximumTrackTintColor="#fff"
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
            }}
          />

          {/* InnerSlider */}

          <View style={style.progressLabelcontainer}>
            <Text style={style.progressleveltxt}>
              {new Date(progress.position * 1000).toISOString().substr(14, 5)}
            </Text>
            <Text style={style.progressleveltxt}>
              {new Date((progress.duration - progress.position) * 1000)
                .toISOString()
                .substr(14, 5)}
            </Text>
          </View>
        </View>
        {/* {Controls} */}

        <View style={style.musiccontrols}>
          <TouchableOpacity onPress={skipToPrevious}>
            <Ionicons color="#fff" name="play-skip-back-outline" size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePlayBack(playbackState)}>
            <Ionicons
              name={
                playbackState === State.Playing
                  ? 'ios-pause-circle'
                  : 'ios-play-circle'
              }
              size={70}
              color="#FF0369"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={skipToNext}>
            <Ionicons color="#fff" name="play-skip-forward-outline" size={30} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Icons */}
{/* 
      <View style={style.bottomview}>
        <View style={style.bottomviewwrapper}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons color="#fff" name="heart-outline" size={30} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons color="#fff" name="repeat" size={30} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons color="#fff" name="share-outline" size={30} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons color="#fff" name="ellipsis-horizontal" size={30} />
          </TouchableOpacity>
        </View>
      </View> */}
    </SafeAreaView>
  );
};

// Stylesheet

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  maincontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  artworkWrapper: {
    width: 320,
    height: 340,
    marginBottom: 25,
  },
  artworkimage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },

  Artist: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 5,
  },
  progresscontainer: {
    width: 350,
    height: 40,
    marginTop: 10,
    flexDirection: 'row',
  },
  progressLabelcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 340,
  },
  progressleveltxt: {
    color: '#fff',
  },
  musiccontrols: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    marginBottom:25,
    justifyContent: 'space-between',
    width: '70%',
  },
  bottomview: {
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#fff',
    marginTop: 10,
  },
  bottomviewwrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },
});

export default MusicPlayer;
