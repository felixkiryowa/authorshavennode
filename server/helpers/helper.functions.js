import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();
/**
 *
 *
 * @class Helper
 */
class Helper {
    /**
     * Hash Password Method
     * @param {string} password
     * @returns {string} returns hashed password
     */
    static hashPassword(password) {
        const salt = bcrypt.genSalt(10);
        const hash = bcrypt.hashSync(password, salt);
        return hash;
    }

    /**
     * comparePassword
     * @param {string} hashPassword
     * @param {string} password
     * @returns {Boolean} return True or False
     */
    static comparePassword(hashPassword, password) {
        return bcrypt.compareSync(password, hashPassword);
    }

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
                return res.json({
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
     * verifyToken
     * @param {string} token
     * @returns {Boolean} return True or False
     */
    static verifyToken(token) {
        try {
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            return decode;
        } catch (error) {
            return error.message;
        }
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
}
export default Helper;
