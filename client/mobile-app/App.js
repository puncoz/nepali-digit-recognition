import React, {Component} from 'react';
import {Image, NetInfo, Text, TouchableHighlight, View} from 'react-native';
import SketchView from 'react-native-sketch-view';
import axios;

const sketchViewConstants = SketchView.constants;

const tools = {};

tools[sketchViewConstants.toolType.pen.id] = {
    id: sketchViewConstants.toolType.pen.id,
    name: sketchViewConstants.toolType.pen.name,
    nextId: sketchViewConstants.toolType.eraser.id,
};
tools[sketchViewConstants.toolType.eraser.id] = {
    id: sketchViewConstants.toolType.eraser.id,
    name: sketchViewConstants.toolType.eraser.name,
    nextId: sketchViewConstants.toolType.pen.id,
};

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            toolSelected: sketchViewConstants.toolType.pen.id,
            imageToPredict: null
        };

        NetInfo.getConnectionInfo().then((connectionInfo) => {
            console.log('Initial, type: ' + connectionInfo.type +
                ', effectiveType: ' + connectionInfo.effectiveType);
        });

        NetInfo.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    }

    handleFirstConnectivityChange(connectionInfo) {
        console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
        NetInfo.removeEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    }

    isEraserToolSelected() {
        return this.state.toolSelected === sketchViewConstants.toolType.eraser.id;
    }

    toolChangeClick() {
        this.setState({toolSelected: tools[this.state.toolSelected].nextId});
    }

    getToolName() {
        return tools[this.state.toolSelected].name;
    }

    onSketchSave(saveEvent) {
        let imagePath = saveEvent.localFilePath;
        this.setState({imageToPredict: (imagePath)});
        console.log("hi", this.state.imageToPredict);
        console.log(saveEvent, this);
        this.predict(imagePath);
    }

    predict(filePath) {
        console.log("hello", filePath);
        const file = {
            uri: filePath,
            name: 'nepali-digit.png',
            type: 'image/png',
        };

        const body = new FormData();
        body.append('data', filePath);

        let url = 'http://192.168.18.250:5000/predict';
        console.log(url);

        console.log("body", body);

        axios.post(url, body).then(response => {
            console.log("hello from axios", response);
        }).catch(error => {
            console.log(error);
        });

        // fetch(url, {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/form-data',
        //     },
        //     data: body
        // }).then(response => {
        //     console.log({response});
        //     return response
        // }).then(data => {
        //     console.log(data);
        // }).catch(error => {
        //     console.log(error);
        // });
    }

    render() {
        let imageToPredict = this.state.imageToPredict ? this.state.imageToPredict.replace(/^\/+|\/+$/g, '') : null
        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <SketchView style={{flex: 1, backgroundColor: 'white'}}
                            ref="sketchRef"
                            selectedTool={this.state.toolSelected}
                            onSaveSketch={this.onSketchSave.bind(this)}
                            localSourceImagePath={'/home'}/>

                <View style={{flexDirection: 'row', backgroundColor: '#EEE'}}>
                    <TouchableHighlight underlayColor={'#CCC'}
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                            paddingVertical: 20,
                                        }}
                                        onPress={() => {
                                            this.refs.sketchRef.clearSketch();
                                        }}>
                        <Text style={{color: '#888', fontWeight: '600'}}>CLEAR</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#CCC'} style={{
                        flex: 1,
                        alignItems: 'center',
                        paddingVertical: 20,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderColor: '#DDD',
                    }} onPress={() => {
                        this.refs.sketchRef.saveSketch();
                    }}>
                        <Text style={{color: '#888', fontWeight: '600'}}>PREDICT</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#CCC'} style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: this.isEraserToolSelected()
                            ? '#CCC'
                            : 'rgba(0,0,0,0)',
                    }} onPress={this.toolChangeClick.bind(this)}>
                        <Text style={{color: '#888', fontWeight: '600'}}>ERASER</Text>
                    </TouchableHighlight>
                </View>
                <View>
                    <Text
                        style={{fontSize: 20, textAlign: 'center'}}>Predicting...</Text>

                    {imageToPredict ? (
                        <Image source={{uri: imageToPredict}}/>
                    ) : (
                        <Text>Tesing...</Text>
                    )}
                </View>
            </View>
        );
    }
}
