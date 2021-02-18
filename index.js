const fs = require("fs")
const qs = require("qs")
const axios = require('axios')
const sendMail = require('./mail')
const config = require('./config')

/**
 * 获取微信社区热门话题列表
 */
const getTopicList = async () => {
    try {
        const url = 'https://developers.weixin.qq.com/community/ngi/question/list'
        const body = {
            page: 1,
            tag: 'topic',
            blocktype: 1,
        }
        const { data } = await axios.get(`${url}?${qs.stringify(body)}`, {})
        return data
    } catch (e) {
        console.log('ERR: ' + e)
    }
}

/**
 * 主程序
 */
const main = async () => {
    let oldContentObject = null
    const path = await fs.readdirSync('./')

    if (path.includes('archive.json')) {
        const content = fs.readFileSync('./archive.json')
        oldContentObject = JSON.parse(content.toString())
    }

    const { data } = await getTopicList()
    if (!data) return
    // 如果有更新，邮件通知
    if (oldContentObject && oldContentObject.count < data.count) {
        const recipient = config.email.user
        const subject = '微信社区热门话题 | 最新话题已更新，快来看看吧！'
        const html = data.rows[0].Title || subject
        sendMail(recipient, subject, html)
    }
    // 保存文件
    const filename = 'archive.json'
    await fs.writeFileSync(`./${filename}`, JSON.stringify(data))
    console.log(`===已保存${filename}===`)
}

main()
