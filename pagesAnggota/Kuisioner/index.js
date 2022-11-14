import { Text, View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Alert, TextInput } from 'react-native'
import React, { Component } from 'react'
import { getDatabase, ref, child, get, remove, query, orderByChild, equalTo, onValue } from "firebase/database";
import { dataTraining, labelTraining } from '../../data';
import KNN from 'ml-knn';

export class Kuisioner extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: {},
      jumlahPertanyaan: 0,
      active: '',
      isLoading: true,
      keyPertanyaan: [],
      halaman: 0,
      isEnd: false,
      userOption: '',
      jumlahJawaban: 0,
      type: '',
      jawaban: 0,
      jawabanFull: [],
      isLoad: false,
      isHasil: false,
      jawabanFullNormalize: []
    }
  }

  async componentDidMount(){
    await this.getData();
    await this.getType()
    this.setState({
      ...this.state,
      isLoading: false,
    })
  }

  async getType(){
    this.setState({
      type: this.state.data[this.state.active].type
    })
  }

  async getData(){
    const dbRef = await ref(getDatabase());
    await get(child(dbRef, `kuis`)).then((snapshot) => {
      if (snapshot.exists()) {
        let jumlahPertanyaan = Object.keys(snapshot.val()).length
        let active = Object.keys(snapshot.val())
        this.setState({
          data: snapshot.val(),
          jumlahPertanyaan:  jumlahPertanyaan,
          keyPertanyaan: active,
          halaman: 1,
          active: active[this.state.halaman],
        })
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  async onKirim(){
    this.state.jawabanFull.push(this.state.jawaban)
    this.setState({
      isLoad: true,
    })
    let knn = []

    //normalisasi
    const tbi = (this.state.jawabanFull[0] - 135)/(180 - 135);
    const tbl = (this.state.jawabanFull[1] - 34.4)/(61 - 34.4);
    const bb = (this.state.jawabanFull[2] - 2.6)/(32.4 - 2.6);
    const tb = (this.state.jawabanFull[3] - 6.9)/(116 - 6.9);

    
     const jawabanFullNormalize = [tbi, tbl, bb, tb]


    //Menghitung jarak tiap data training dengan data baru
    for (let i = 0; i < dataTraining.length; i++) {
      let poin = 0;
      for(let j = 0; j < jawabanFullNormalize.length; j++){
          if (isNaN(jawabanFullNormalize[j])) {
            if(jawabanFullNormalize[j] == dataTraining[i][j]){
              poin = poin + 0
            }else{
              poin = poin + 1
            }
          }else{
            let hasil = Math.abs(dataTraining[i][j] - jawabanFullNormalize[j])
            poin = poin + hasil
          }
      }
      knn.push([poin, dataTraining[i][4]]) 
      
    }

    
    knn.sort(sortFunction);
    
    function sortFunction(a, b) {
      if (a[0] === b[0]) {
          return 0;
      }
      else {
          return (a[0] < b[0]) ? -1 : 1;
      }
    }
    
    const k = 5;
    
    //mengambil data paling atas sesuai dengan K
    const arrayBaru = knn.filter((x, y) => y < k);
    // console.log(arrayBaru)

   //filter Sangat Pedek
   const filterYa = await arrayBaru.filter(item => item[1] == 'Ya');
   const filterTidak = await arrayBaru.filter(item => item[1] == 'Tidak');

   const jumlahStatus = [
    [filterYa.length, 'Ya'],
    [filterTidak.length, 'Tidak'],
   ]

   jumlahStatus.sort(sortFunction)

  //  console.log(knn)
   this.props.navigation.navigate('HasilTes', {status: await jumlahStatus[1][1], data: this.state.jawabanFull})

  }

  async onNext(){
    if (this.state.type == 'number') {
      if(this.state.jawaban == ''){
        Alert.alert('Error', 'Mohon Masukkan Jawaban')
      }
      else{
        this.state.jawabanFull.push(this.state.jawaban)
        await this.setState({
          halaman: this.state.halaman + 1,
          active: this.state.keyPertanyaan[this.state.halaman],
          jawaban: ''
        })
  
        await this.getType();
  
        if (this.state.halaman == this.state.jumlahPertanyaan) {
          this.setState({
            isEnd: true,
          })
        }
      }
    }
    else{
    if(this.state.userOption == ''){
      Alert.alert('Error', 'Mohon pilih salah satu jawaban')
    }
    else{
      this.state.jawabanFull.push(this.state.userOption)
      await this.setState({
        halaman: this.state.halaman + 1,
        active: this.state.keyPertanyaan[this.state.halaman],
        userOption: ''
      })

      await this.getType();

      if (this.state.halaman == this.state.jumlahPertanyaan) {
        this.setState({
          isEnd: true,
        })
      }
    }
  }
  }

  render() {
    // console.log(this.state.knn)
    if (this.state.isLoading) {
      return(
        <Text>Loading</Text>
      )
    }
    else{
      if(this.state.isHasil){
        return(
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red'}}>
            <Text>Halo</Text>
          </View>
        )
      }
      else{
      if (this.state.type == 'radio') {
        return (
          <View style={styles.container}>
            <Text style={styles.heading1}>Kuisioner Penentuan Stunting</Text>
            <Text style={styles.textProgres}>{this.state.halaman} dari {this.state.jumlahPertanyaan}</Text>
            <View>
              <View style={styles.progres}></View>
              <View style={{width: ((width - 60) / this.state.jumlahPertanyaan) * (this.state.halaman - 1),
                height: 5,
                backgroundColor: '#5669ff',
                position: 'absolute'}}>
              </View>
            </View>
  
            <View style={styles.wrapperPertanyaan}>  
              <Text style={styles.pertanyaan}>{this.state.data[this.state.active].pertanyaan}</Text>
              <Text style={styles.desc}>{this.state.data[this.state.active].desc}</Text>
            </View>
  
            <FlatList
              data={Object.keys(this.state.data[this.state.active].tanggapan)}
              style={styles.listJawaban}
              renderItem={({item}) => {
                return(
                  <View>
                    <TouchableOpacity onPress={() => this.setState({userOption: this.state.data[this.state.active].tanggapan[item].poin})} style={this.state.data[this.state.active].tanggapan[item].jawaban[0] === this.state.userOption ? styles.containerJawabanSelected : styles.containerJawaban}>
                      <Text style={this.state.data[this.state.active].tanggapan[item].jawaban[0] === this.state.userOption ? styles.textJawabanSelected : styles.textJawaban}>{this.state.data[this.state.active].tanggapan[item].jawaban}</Text>
                    </TouchableOpacity>
                  </View>
                )
              }}
              keyExtractor={item => item}
            />
            {!this.state.isEnd &&
            <TouchableOpacity onPress={() => {this.onNext()}} style={styles.tombolNext}>
              <Text style={styles.textTombol}>Selanjutnya</Text>
            </TouchableOpacity>
            }
            {this.state.isEnd &&
            <TouchableOpacity onPress={() => {this.onKirim()}} style={styles.tombolNext}>
              <Text style={styles.textTombol}>Kirim</Text>
            </TouchableOpacity>
            }
          </View>
        )
      }
      else if(this.state.type == 'number'){
        return(
        <View style={styles.container}>
            <Text style={styles.heading1}>Kuisioner</Text>
            <Text style={styles.textProgres}>{this.state.halaman} dari {this.state.jumlahPertanyaan}</Text>
            <View>
              <View style={styles.progres}></View>
              <View style={{width: ((width - 60) / this.state.jumlahPertanyaan) * (this.state.halaman - 1),
                height: 5,
                backgroundColor: '#5669ff',
                position: 'absolute'}}>
              </View>
            </View>
            <View style={styles.wrapperPertanyaan}>  
              <Text style={styles.pertanyaan}>{this.state.data[this.state.active].pertanyaan}</Text>
              <Text style={styles.desc}>{this.state.data[this.state.active].desc}</Text>
            </View>
  
            <TextInput 
              style={styles.input}
              value={this.state.jawaban}
              onChangeText={(text) => this.setState({jawaban: text})}
              placeholder="Masukkan jawaban"
              keyboardType="numeric"
            ></TextInput>

            {!this.state.isEnd &&
            <TouchableOpacity onPress={() => {this.onNext()}} style={styles.tombolNext}>
              <Text style={styles.textTombol}>Selanjutnya</Text>
            </TouchableOpacity>
            }
            {this.state.isEnd &&
            <TouchableOpacity onPress={() => {this.onKirim()}} style={styles.tombolNext}>
              <Text style={styles.textTombol}>Kirim</Text>
            </TouchableOpacity>
            }
          </View>
        )
      }
    }
    } 
  }
}

const width = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 50,
  },
  heading1: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#5669ff',
  },
  progres: {
    width: width - 60,
    height: 5,
    backgroundColor: '#999'
  },
  textProgres: {
    fontFamily: 'Poppins-Bold',
    marginTop: 20,
  },
  wrapperPertanyaan: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%'
  },
  pertanyaan: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    color: '#5669ff',
    textAlign: 'left',
    marginTop: 40
  },
  desc: {
    fontFamily: 'Poppins-Reg',
    fontSize: 15,
    color: '#999'
  },
  listJawaban: {
    maxHeight: 400,
    marginTop: 30,
  },
  containerJawaban: {
    backgroundColor: '#ddd',
    width: width - 60,
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 7,
  },
  containerJawabanSelected: {
    backgroundColor: '#5669ff',
    width: width - 60,
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 7,
  },
  textJawaban: {
    fontFamily: 'Poppins-Reg',
    color: '#444'
  },
  textJawabanSelected: {
    fontFamily: 'Poppins-Reg',
    color: '#fff'
  },
  tombolNext: {
    backgroundColor: '#5669ff',
    width: width - 60,
    padding: 15,
    borderRadius: 7,
    alignItems: 'center'
  },
  textTombol: {
    color: '#fff',
    fontFamily: 'Poppins-Reg'
  },
  input: {
    width: width - 60,
    marginHorizontal: 20,
    margin: 12,
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 7,
    marginVertical: 10,
  },
})

export default Kuisioner