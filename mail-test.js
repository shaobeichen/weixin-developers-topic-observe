const fs = require('fs')
const qs = require('qs')
const axios = require('axios')
const sendMail = require('./mail')
const config = require('./config')

/**
 * 主程序
 */
const main = async () => {
  const recipient = config.email.user
  sendMail(recipient, '测试邮件发送是否正常', '测试通过！')
}

main()
