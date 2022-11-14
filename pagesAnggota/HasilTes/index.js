import { Text, View, StyleSheet, Image,TouchableOpacity } from 'react-native'
import React, { Component } from 'react'

export class HasilTes extends Component {
  constructor(props){
    super(props);
    this.state = {
      hasil: '',
    }
    
  }


  render() {
    const {navigation,route}=this.props;
    const { status, data} = route.params;
    if(status == 'Tidak'){
      return (
        <View style={styles.container}>
          <Text style={styles.heading1}>HASIL PERHITUNGAN</Text>
          <View style={styles.wrapperGambar}>
          <Image source={require(`../../assets/tinggi.png`)} style={styles.gambar}/>
          </View>
          {status == "Ya" &&
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.dataAnswer}>Hasil</Text> 
              <Text style={styles.textHasil2}>Stunting</Text> 
            </View>
          </View>
           }
          {status == "Tidak" &&
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.dataAnswer}>Hasil</Text> 
              <Text style={styles.textHasil2}>Normal</Text> 
            </View>
          </View>
           }
          <View style={styles.row2}>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Tinggi Badan Ibu</Text> 
              <Text style={styles.dataAnswer}>{data[0]} cm</Text> 
            </View>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Tinggi Badan Lahir</Text> 
              <Text style={styles.dataAnswer}>{data[1]} cm</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Berat Badan</Text> 
              <Text style={styles.dataAnswer}>{data[2]} kg</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Tinggi Badan</Text> 
              <Text style={styles.dataAnswer}>{data[3]} cm</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.tombol} onPress={()=> this.props.navigation.popToTop()}>
            <Text style={styles.textTombol}>Kembali</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else{
      return (
        <View style={styles.container}>
          <Text style={styles.heading1}>HASIL PERHITUNGAN</Text>
          <View style={styles.wrapperGambar}>
          <Image source={require(`../../assets/pendek.png`)} style={styles.gambar}/>
          </View>

          <View style={styles.rowRed}>
            <View style={styles.col}>
              <Text style={styles.dataAnswer}>Hasil</Text> 
              <Text style={styles.textHasil2}>Stunting</Text> 
            </View>
          </View>

          <View style={styles.row2}>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Tinggi Badan Ibu</Text> 
              <Text style={styles.dataAnswer}>{data[0]} cm</Text> 
            </View>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Tinggi Badan Lahir</Text> 
              <Text style={styles.dataAnswer}>{data[1]} cm</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Berat Badan</Text> 
              <Text style={styles.dataAnswer}>{data[2]} kg</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Tinggi Badan</Text> 
              <Text style={styles.dataAnswer}>{data[3]} cm</Text>
            </View>
          </View>
          <View>
            <Text style={styles.textPerigatan}>Penuhi aspuan gizi bayi anda dan periksakan ke fasilitas kesehatan terdekat</Text>
          </View>
          <TouchableOpacity style={styles.tombol} onPress={()=> this.props.navigation.popToTop()}>
            <Text style={styles.textTombol}>Kembali</Text>
          </TouchableOpacity>
        </View>
      )
    }
    
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    // justifyContent: 'center'
  },
  heading1: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#5669ff',
    marginTop: 20,
  },
  textPengantar: {
    fontFamily: 'Poppins-Reg',
    color: '#444',
    textAlign: 'center'
  },
  row: {
    backgroundColor: '#5669ff',
    paddingVertical: 10,
    marginTop: 100,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  rowRed: {
    backgroundColor: '#dd3333',
    paddingVertical: 10,
    marginTop: 100,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  col: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30
  },
  row2: {
    marginTop: 60,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around'
  },
  col2: {
    flexDirection: 'column',
  },
  textHasil: {
    fontSize: 40,
    fontFamily: 'Poppins-Bold',
    color: '#dd3333',
    marginTop: 20,
    marginBottom: 50,
  },
  textHasil2: {
    fontSize: 25,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  dataWrapper: {
    width: '50%',
    marginTop: 20,
    marginBottom: 20,
  },
  data:{
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  dataItem: {
    flexDirection: 'column'
  },
  dataQuestion: {
    marginTop: 3,
  },
  dataAnswer: {
    fontFamily: 'Poppins-Bold'
  },
  wrapperGambar: {
    backgroundColor: '#ffcd3f',
    borderRadius: 100,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 75,
    borderWidth: 11,
    borderColor: '#5b3b1d',
    borderStyle: 'dashed',
  },
  gambar: {
    width: 120,
    height: 120,
  },
  tombol: {
    backgroundColor: '#5669ff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 100,
  },
  textTombol: {
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  textPerigatan: {
    color: 'red',
    fontFamily: 'Poppins-Bold',
    marginTop: 20,
    textAlign: 'center'
  }
})
export default HasilTes