import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { Component } from 'react'
import { getDatabase, ref, child, get, remove, query, orderByChild, equalTo, onValue } from "firebase/database";

export class TentangStunting extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataInfo: {},
            jumlahInfo: 0,
            halaman: 0,
            keyInfo: [],
            active: '',
            isLoad: true
        }
    }

    async componentDidMount(){
        await this.getData();

        this.setState({
            isLoad: false
        })
    }

    async getData(){
        const dbRef = await ref(getDatabase());
        await get(child(dbRef, `dataInformasi`)).then((snapshot) => {
          if (snapshot.exists()) {
            let jumlahInfo = Object.keys(snapshot.val()).length
            let active = Object.keys(snapshot.val())
            this.setState({
              dataInfo: snapshot.val(),
              jumlahInfo:  jumlahInfo,
              keyInfo: active,
              halaman: 0,
              active: active[this.state.halaman],
            })
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
      }

    async onNext(){
        await this.setState({
          halaman: this.state.halaman + 1,
        })
        this.setState({
          active: this.state.keyInfo[this.state.halaman],
          userOption: ''
        })
      
    }  
    async onPrevious(){
      await this.setState({
        halaman: this.state.halaman - 1,
      })
      this.setState({
        active: this.state.keyInfo[this.state.halaman],
        userOption: ''
      })
      
    }  

  render() {
    console.log(this.state.halaman)
    if (this.state.isLoad) {
        return(
            <Text>Loading</Text>
        )
    }
    else{
    return (
      <View style={styles.container}>
        <Image source={{uri: this.state.dataInfo[this.state.active].urlImage}} style={styles.gambar} />
        <Text style={styles.heading1}>{this.state.dataInfo[this.state.active].heading}</Text>
        <FlatList
            data={Object.keys(this.state.dataInfo[this.state.active].paragraf)}
            renderItem={({item}) => {
                return(
                <View>
                    <Text style={styles.paragraf}>{this.state.dataInfo[this.state.active].paragraf[item]}</Text>
                </View>
                )}}
        />
        <View style={styles.wrapperTombol}>
          {this.state.halaman > 0 &&
          <TouchableOpacity style={styles.tombolPrevious} onPress={() => {this.onPrevious()}}>
              <Text style={styles.textTombolPrevious}>Sebelumnya</Text>
          </TouchableOpacity>
          }
          {this.state.halaman == this.state.jumlahInfo - 1 &&
            <TouchableOpacity style={styles.tombolNext} onPress={() => {this.props.navigation.goBack()}}>
                <Text style={styles.textTombol}>Selesai</Text>
            </TouchableOpacity>
          }
          {this.state.halaman < this.state.jumlahInfo - 1 &&
            <TouchableOpacity style={styles.tombolNext} onPress={() => {this.onNext()}}>
                <Text style={styles.textTombol}>Selanjutnya</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    )
    }
  }
}

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    gambar: {
        width: width - 40,
        height: width - 40,
    },
    heading1: {
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        color: '#5669ff',
        marginBottom: 10,
    },
    heading2: {
        fontFamily: 'Poppins-Reg',
        fontSize: 15,
        color: '#999'
    },
    paragraf: {
        fontFamily: 'Poppins-Reg',
        color: '#888',
        textAlign: 'justify'
    },
    wrapperTombol:{
      flexDirection: 'row',
      position: 'absolute',
      bottom: 20,
      left: 20,
      justifyContent: 'space-between',
      width: width - 40,
    },
    tombolNext: {
        backgroundColor: '#5669ff',
        padding: 15,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        width: (width/2) - 40,
        position: 'absolute',
        right: 20,
        bottom: 1,
    },
    textTombol: {
        fontFamily: 'Poppins-Bold',
        color: '#fff'
    },
    tombolPrevious: {
        borderWidth: 1,
        borderColor: '#5669ff',
        padding: 15,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        width: (width/2) - 40,
        
        backgroundColor: '#fff'
    },
    textTombolPrevious: {
        fontFamily: 'Poppins-Bold',
        color: '#5669ff',
    }
})
export default TentangStunting