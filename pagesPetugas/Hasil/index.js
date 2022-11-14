import { Text, View, StyleSheet, Image,TouchableOpacity } from 'react-native'
import React, { Component } from 'react'

export class Hasil extends Component {
  constructor(props){
    super(props);
    this.state = {
      hasil: '',
    }
    
  }


  render() {
    const {navigation,route}=this.props;
    const { hasil, tinggi, usia, berat, jenisKelamin, zScore } = route.params;
    if(hasil == 'Normal' || hasil == 'Tinggi'){
      return (
        <View style={styles.container}>
          <Text style={styles.heading1}>HASIL PERHITUNGAN</Text>
          <View style={styles.wrapperGambar}>
          <Image source={require(`../../assets/tinggi.png`)} style={styles.gambar}/>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.dataAnswer}>Z-Score</Text> 
              <Text style={styles.textHasil2}>{zScore}</Text> 
            </View>
            <View style={styles.col}>
              <Text style={styles.dataAnswer}>Kategori</Text> 
              <Text style={styles.textHasil2}>{hasil}</Text> 
            </View>
          </View>

          <View style={styles.row2}>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Jenis Kelamin</Text> 
              <Text style={styles.dataAnswer}>{jenisKelamin}</Text> 
            </View>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Usia</Text> 
              <Text style={styles.dataAnswer}>{usia} Bulan</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Tinggi</Text> 
              <Text style={styles.dataAnswer}>{tinggi} cm</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Berat</Text> 
              <Text style={styles.dataAnswer}>{berat} Kg</Text>
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
              <Text style={styles.dataAnswer}>Z-Score</Text> 
              <Text style={styles.textHasil2}>{zScore}</Text> 
            </View>
            <View style={styles.col}>
              <Text style={styles.dataAnswer}>Kategori</Text> 
              <Text style={styles.textHasil2}>{hasil}</Text> 
            </View>
          </View>

          <View style={styles.row2}>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Jenis Kelamin</Text> 
              <Text style={styles.dataAnswer}>{jenisKelamin}</Text> 
            </View>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Usia</Text> 
              <Text style={styles.dataAnswer}>{usia} Bulan</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Tinggi</Text> 
              <Text style={styles.dataAnswer}>{tinggi} cm</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.dataQuestion}>Berat</Text> 
              <Text style={styles.dataAnswer}>{berat} Kg</Text>
            </View>
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
  }
})
export default Hasil