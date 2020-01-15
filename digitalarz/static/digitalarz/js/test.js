function isPalindrome(word)
{
  // Please write your code here.
  revservseWord = ""
  word = word.toLowerCase()
  for(let i=word.length-1;i >=0;i--){
    revservseWord +=word[i];
  }
  if (revservseWord == word){
    return true;
  }
  return false;
}
// var word = readline()
val =isPalindrome("Deaed")
console.log(val)