import { Href, router } from "expo-router";
import { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-swiper";

import CustomButton from "@/components/CustomButton";
import { onboarding } from "@/constants/icons";
import { Colors } from "@/utility/colors";

const Home = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.replace("/(auth)/sign-up" as Href<string>)}
        style={styles.skipButton}
      >
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>

      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View key={item.id} style={styles.slide}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}
      </Swiper>

      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() =>
          isLastSlide
            ? router.replace("/(auth)/sign-up" as Href<string>)
            : swiperRef.current?.scrollBy(1)
        }
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'space-between',
    backgroundColor: Colors.background,
  },
  skipButton: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  skipButtonText: {
    fontSize: 18,
    fontFamily: 'PoppinsBold',
    color: 'black',
  },
  dot: {
    width: 32,
    height: 4,
    marginHorizontal: 1,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 10,
  },
  activeDot: {
    width: 32,
    height: 4,
    marginHorizontal: 1,
    backgroundColor:  Colors.primary,
    borderRadius: 10,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 40,
  },
  title: {
    fontSize: 36,
    fontFamily: 'PoppinsBold',
    color: 'black',
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    fontFamily: 'Poppins',
    color: '#858585',
    textAlign: 'center',
    marginHorizontal: 40,
    marginTop: 10,
  },
  button: {
    width: '90%',
    marginTop: 40,
    marginBottom: 20,
  },
});

export default Home;
