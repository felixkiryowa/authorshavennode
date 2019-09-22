import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();
/**
 *
 *
 * @class Helper
 */
export default class Helper {
   
    /**
     * Generate Token
     * @param {string} payload
     * @param {string} expiresInPeriod
     * @returns {string} token
     */
    static generateToken(payload, res) {
          jwt.sign(
              payload,
              process.env.SECRETKEY, {
                  expiresIn: 3600
              },
              (err, token) => {
                return res.status(200).json({
                      success: true,
                      token: 'Bearer ' + token
                  });
              }
          );
    }

     /**
      * Handle Error
      * @param {object} error
      * @param {string} res
      * @returns {string} token
      */
     static handleErrors(res, error) {
         res.status(500).json({
             message: error.message
         });
     }


    /**
     *
     *
     * @static
     * @param {*} body
     * @returns {integer} word count
     * @memberof Helper
     */
    static countWords(body) {
        // regex meaning:
        // ^  -->  Match any character that is not the set in this case (\s)
        // \s -->   Matches any whitespace character (spaces, tabs, line breaks)
        // /g -->  Search everyting
        return (body.match(/[^\s]+/g) || []).length;
    }

    /**
     *
     *
     * @static
     * @param {*} body
     * @returns {string} article read time
     * @memberof Helper
     */
    static calculateReadTime(body) {
        const readingSpeedInWordsPerMinute = 256; // Average reading speed of an adult
        const wordCount = this.countWords(body);
        const readTime = Math.ceil((wordCount / readingSpeedInWordsPerMinute));
        const formatedReadTime = `${readTime} min read`;
        return formatedReadTime;
    }

    static testFunction(a, b){
        return a + b ;
    }
}

