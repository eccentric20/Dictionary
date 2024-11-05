import ejs from 'ejs'
import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', async(req, res) => {
    res.render('index.ejs');
})

app.post('/search', async(req, res) => {

    const wordSearch = req.body.word;
    try{
        const resp = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordSearch}`);
        const wordData = resp.data[0];
        res.render('index.ejs', {
            word: wordSearch,
            pronunciation: wordData.phonetics[0]?.audio,
            partOfSpeech: wordData.meanings[0]?.partOfSpeech,
            phonetics: wordData.phonetics[0]?.text,
            definition: wordData.meanings[0]?.definitions[0]?.definition,
            example: wordData.meanings[0]?.definitions[0]?.example || "No example available"
        });
    }
    catch(error){
        console.log(error);
        res.render('index.ejs', {error: error.message});
    }
    
})

app.listen(port, () =>{
    console.log(`Server is running on the port ${port}`);
})