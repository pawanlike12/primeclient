import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  ImageBackground,
  AsyncStorage,
  Alert,ScrollView,WebView
} from 'react-native';
import styles from '../assets/style/Stylesheet';
import Snackbar from 'react-native-snackbar';
import { TouchableOpacity } from 'react-native-gesture-handler';
export default class ChangePassword extends Component{
    constructor(props) {
        super(props);
        this.state={
            password:'',
            newPassword:""
        }
    }
    componentDidMount(){
        console.log(this.props.navigation.state.params.id)
    }

    onSubmit=()=>{
    //   if(this.state.password==''){
    //     Snackbar.show({
    //       title: 'Password required',
    //       backgroundColor:'#f00',
    //       color:'#fff',
    //       duration: Snackbar.LENGTH_SHORT,
    //     });
    //   }
    //   else if(this.state.password.length < 5){
    //     Snackbar.show({
    //       title: 'Password must be atleast 6 characters',
    //       backgroundColor:'#f00',
    //       color:'#fff',
    //       duration: Snackbar.LENGTH_SHORT,
    //     });
    //   }
    //   else if(this.state.confirmPassword==''){
    //     Snackbar.show({
    //       title: 'Repeat password required',
    //       backgroundColor:'#f00',
    //       color:'#fff',
    //       duration: Snackbar.LENGTH_SHORT,
    //     });
    //   }
    //   else if(this.state.confirmPassword!=this.state.password){
    //     Snackbar.show({
    //       title: 'Repeat Password Not matched',
    //       backgroundColor:'#f00',
    //       color:'#fff',
    //       duration: Snackbar.LENGTH_SHORT,
    //     });
    //   } 
    //   else{

    //     console.log(JSON.stringify({
    //       id:this.props.navigation.state.params.id,
    //       password: this.state.password,
    //        }))
     
    //   }

    if(this.state.password==''){
      Snackbar.show({
        title: 'Password required',
        backgroundColor:'#f00',
        color:'#fff',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
   
    else if(this.state.newPassword==''){
      Snackbar.show({
        title: 'New password required',
        backgroundColor:'#f00',
        color:'#fff',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
    else if(this.state.newPassword.length < 5){
      Snackbar.show({
        title: 'New Password must be atleast 6 characters',
        backgroundColor:'#f00',
        color:'#fff',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
    else if(this.state.confirmPassword!=this.state.newPassword){
      Snackbar.show({
        title: 'Confirm Password Not matched',
        backgroundColor:'#f00',
        color:'#fff',
        duration: Snackbar.LENGTH_SHORT,
      });
    } 

    else{

      console.log( JSON.stringify({
        id:this.props.navigation.state.params.id,
        // password: ,
        oldp:this.state.password,
        newp:this.state.newPassword
      }))

    fetch('http://203.190.153.20/primeclient/primeclientApi/Api/update_password',{
        method: 'POST',
        headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id:this.props.navigation.state.params.id,
      // password: ,
      oldp:this.state.password,
      newp:this.state.newPassword
    })
  
      }).then((response) => response.json())
      .then((responseJson) => {
        
        //  console.log(responseJson.rows.length);
          this.setState( { data: responseJson });
          console.log(this.state.data['message']);
          console.log(this.state.data['status']);
          this.setState({
              id: this.state.data['data']
          })
          var count = Object.keys(responseJson).length;
          console.log(count);
  // Showing response message coming from server after inserting records.
          if(this.state.data['status']==1){
            Alert.alert(' Update Password',this.state.data['message'],[
              {
                'text':'Ok',
                onPress:() => {
                    this.props.navigation.navigate("UserProfile");
                  }
                // onPress:()=>{
                //   this.props.navigation.dispatch(StackActions.reset({
                //     index: 0,
                //     actions: [
                //       NavigationActions.navigate({ routeName: 'Login' })
                //     ],
                //   }))
                // }
              }
            ])
          }
          else{
              Alert.alert(this.state.data['message'])
          }
  
      }).catch((error) => {
        console.error(error);
      });


    }

   
       
    }

    render(){
        return(
            <ScrollView>
                 <View style={styles.container}>
            <View style={styles.newConatiner}>
                <Image source={require('../assets/images/logo_small.png')} style={styles.Smalllogo} />
                 <View style={{width:'100%', height:"100%", alignItems:"center", marginTop:20,
                  padding: 20, }}>
                   <Text style={styles.titleText}>Change Your</Text>
                   <Text style={[styles.titleText,{marginBottom:20}]}>Pasword</Text>
                   <Text style={{textAlign:"center", fontSize:15, marginBottom:15}}>
                   Password should be a combination of  6 numbers
                   </Text>
                   <Text style={{textAlign:"center", fontSize:17, marginBottom:15}}>Old Password</Text>
                             <TextInput style={styles.inputs}
                                placeholder="******"
                                secureTextEntry={true}
                                keyboardType={'default'} 
                                underlineColorAndroid='transparent'
                                onChangeText={password => this.setState({password})}/>
                                <Text style={{textAlign:"center", fontSize:17,marginBottom:15}}>New Password</Text>
                             <TextInput style={styles.inputs}
                                placeholder="******"
                                secureTextEntry={true}
                                keyboardType={'default'} 
                                underlineColorAndroid='transparent'
                                onChangeText={newPassword => this.setState({newPassword})}/>
                                 <Text style={{textAlign:"center", fontSize:17,marginBottom:15}}>Confirm Password</Text>
                             <TextInput style={styles.inputs}
                                placeholder="******"
                                secureTextEntry={true}
                                keyboardType={'default'} 
                                underlineColorAndroid='transparent'
                                onChangeText={confirmPassword => this.setState({confirmPassword})}/>

                    <View style={styles.btnView}>
                             <TouchableOpacity style={[styles.Whitebtn,{marginBottom:30}]}
                              onPress={this.onSubmit}>
                                 <Text style={styles.blackText}>Update</Text>
                             </TouchableOpacity>
                             
                         </View>
                </View>
                
            </View>
        </View>
            </ScrollView>
        );
    }
}