/*
사용자가 검색할 수 있는 지도 화면

사용자가 검색어 입력 후 장소를 검색하고 선택 가능.
카카오맵 WebView 내부에서 검색 기능 (searchPlaces()) 실행.
*/

import React, { useState, useRef, useEffect } from "react"; // ✅ useEffect 추가
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import MiniButton from "../Components/MiniButton";
import axios from "axios";
import config from "../config";
import { useUserState } from "../Contexts/UserContext";


const MapScreen = () => {
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [user] = useUserState();

    // ✅ Kakao API 요청 함수 (REST API Key 사용)
    const fetchKakaoAddress = async (query) => { 
      try {
        console.log(`🔍 Kakao API 요청: ${query}`);
  
        const response = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}`, {
          method: 'GET',
          headers: {
            'Authorization': `KakaoAK ${config.KAKAO_REST_API_KEY}`, // ✅ REST API Key 사용
            'Content-Type': 'application/json',
          }
        });
  
        console.log('✅ Response Status:', response.status);
        const data = await response.json();
        console.log('📍 Kakao API 응답 데이터:', data);
  
        if (data.documents && data.documents.length > 0) {
          const firstResult = data.documents[0];
          setSelectedPlace({
            name: firstResult.place_name,
            address: firstResult.road_address_name || firstResult.address_name,
            lat: firstResult.y,
            lng: firstResult.x,
          });
  
          console.log('📍 검색 결과:', firstResult);
        } else {
          console.log('❌ No results found');
        }
      } catch (error) {
        console.error('❌ Kakao API 요청 오류:', error);
      }
    };


  // 사용자가 입력한 검색어를 기반으로 WebView 내에서 장소를 검색
  const handleSearch = () => {
    console.log("🔍 검색 버튼 눌림! 현재 입력값:", searchQuery);
  
    if (searchQuery.trim() !== '') {
      fetchKakaoAddress(searchQuery);
    } else {
      console.log("❌ 검색어를 입력하세요.");
    }
  };

  useEffect(() => {
    if (searchQuery) {
      console.log("🔍 자동 검색 실행:", searchQuery);
      fetchKakaoAddress(searchQuery);
    }
  }, [searchQuery]); // ✅ 검색어가 변경될 때 자동 검색 실행

  // 선택한 장소를 서버에 등록하고, 등록 후 목록 화면으로 이동
  const handleRegistration = async () => {
    if (!selectedPlace) {
      alert("장소를 선택해주세요!");
      return;
    }
  
    console.log("📩 장소 등록 요청:", {
      userId: user?.user_id,
      name: selectedPlace.name,
      address: selectedPlace.address,
      lat: selectedPlace.lat,
      lng: selectedPlace.lng,
    });
  
    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/map/${user?.user_id}`, {
        userId: user?.user_id,
        name: selectedPlace.name,
        address: selectedPlace.address,
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
      });
  
      console.log("✅ 등록 완료:", response.data);
      // ✅ 장소 등록 후 ListScreen으로 이동하도록 수정
      navigation.navigate("ListScreen", { refresh: true });

    } catch (error) {
      console.error("❌ 등록 오류:", error.response?.data || error.message);
    }
  };

  // WebView에서 선택한 장소 정보를 받아와 상태로 저장
  const handleMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    setSelectedPlace(data);
  };

  return (
    <View style={styles.container}>
      {/* 검색창 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="장소 검색"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title="검색" onPress={() => {
          console.log("🔍 검색 버튼 클릭됨");
          handleSearch();
          }} />
      </View>

      {/* 카카오 지도 WebView */}
      <WebView
  ref={webViewRef}
  source={{ html: getMapHtml() }}
  javaScriptEnabled={true} // ✅ JavaScript 실행 허용
  domStorageEnabled={true} // ✅ localStorage 사용 허용
  onMessage={handleMessage}
  onLoad={() => webViewRef.current.injectJavaScript('console.log("✅ WebView Loaded!");')}
/>

      {/* 선택한 장소 정보 */}
      {selectedPlace && (
        <View style={styles.infoContainer}>
          <Text>{selectedPlace.name}</Text>
          <Text>{selectedPlace.address}</Text>
          <MiniButton title="등록하기" onPress={handleRegistration} />
        </View>
      )}
    </View>
  );
};

console.log("✅ KAKAO_MAP_API_KEY:", config.KAKAO_MAP_API_KEY);


// 카카오 지도 API를 사용하여 장소 검색 및 선택 기능을 제공하는 HTML 코드
const getMapHtml = () => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>카카오 지도</title>
  <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${config.KAKAO_JAVASCRIPT_KEY}&libraries=services"></script>
</head>
<body>
  <div id="map" style="width:100%; height:500px; background-color: lightgray;"></div>
  <script>
    console.log("✅ 카카오 지도 API 로드됨");

    function initMap() {
      var mapContainer = document.getElementById('map');
      if (!mapContainer) {
        console.error("❌ 지도 컨테이너를 찾을 수 없습니다.");
        return;
      }
      console.log("✅ 지도 컨테이너 확인됨:", mapContainer);

      var mapOption = { 
          center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
          level: 3 // 지도의 확대 레벨
      };

      var map = new kakao.maps.Map(mapContainer, mapOption);
      console.log("✅ 지도 생성 완료:", map);
    }

    // ✅ 페이지가 완전히 로드된 후 initMap 실행
    window.onload = initMap;
  </script>
</body>
</html>
`;





const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
});

export default MapScreen;
