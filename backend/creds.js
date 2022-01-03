let aws_keys = {
    dynamodb: {
        apiVersion: '2012-08-10',
        region: 'us-west-2',
        accessKeyId: "",
        secretAccessKey: ""
    },
    s3: {
        region: 'us-west-2',
        accessKeyId: "",
        secretAccessKey: ""
    
    },
    rekognition:{
        region: 'us-east-2',
        accessKeyId: '',
        secretAccessKey: ''
    },
    translate: {
        region: 'us-east-2',
        accessKeyId: "",
        secretAccessKey: "" 
    },
    lex: {
        region: 'us-east-2',
        accessKeyId: "",
        secretAccessKey: "" 
    },
    polly:{
        region: 'us-east-2',
        accessKeyId: "",
        secretAccessKey: "" 
    }

}
module.exports = aws_keys
