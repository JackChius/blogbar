

接触wsl2开发也有一段时间了，总结一个字就是真的香。

目前chuler所有的前后端，数据库，app开发等等几乎所有的环境都部署在了wsl2上，总体上好处多于缺点，当然其中还是存在，一些与原生linux的不同，需要时间去磨合。

### win10系统中wsl2开启systemctl命令

> 刚开始用wsl2的时候，会发现ubuntu上常用的systemctl消失了，默认情况下在wsl2中使用systemctl命令会报错

<!-- more -->

```
$ sudo systemctl status cron.service
**System has not been booted with systemd as init system (PID 1). Can't operate.
Failed to connect to bus: Host is down**
```

**解决办法:**

1. 安装daemonize

    ```
    sudo apt-get install daemonize

    ```
 
2. 执行以下两句命令开启

    ```
    sudo daemonize /usr/bin/unshare --fork --pid --mount-proc /lib/systemd/systemd --system-unit=basic.target

    exec sudo nsenter -t $(pidof systemd) -a su - $LOGNAME
    ```

### 与VMWare的兼容问题

> 之前在win10上进行linux开发常用的就是vm虚拟机，切换到wsl后问题也来了，wsl2 和 VMWare 并不能和谐共存。。（更新：新版vm能与wsl2共存，但是涉及部分io操作性能会下降厉害）

查阅微软官方文档得知，打开 **wsl2** 需要执行命令：

```
Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
```

由此命令推出，如果要在只用 vm 的环境，那么只能临时禁用wsl2了

```
Disable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
```

重启之后，Vmware完美启动。

与此同时，**wsl2** 就会下线了，想用只能再次切回去。

```
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
wsl --set-default-version 2
```

### **WSL2通过Clash for Windows使用Windows代理(Linux系统设置/一次生效)**

> 在需要用到代理网络，连接隧道网络等场景下，修改系统proxy配置，让代理穿透到wsl中。

export hostip=$(cat /etc/resolv.conf |grep -oP '(?<=nameserver\ ).*')

export https_proxy="http://${hostip}:7890"

export http_proxy="http://${hostip}:7890"

### **设置wsl2内端口映射，让局域网可访问wsl2内程序**

> 由于wsl2每次启动均是不同的虚拟IP,在调试、运行一些特殊应用的时候，开启端口转发能让wsl2内app与外界（宿主机）沟通并传输数据。

1. 管理员权限运行powershell
2. netsh interface portproxy add v4tov4 listenport=* listenaddress=0.0.0.0 connectport=* connectaddress=* protocol=tcp

    *代表所有端口，connectaddress=*为wsl内网地址

3. netsh interface portproxy show all 查看端口转发状态
4. 关闭防火墙或者设置入站转发规则
5. 删除端口转发：netsh interface portproxy delete v4tov4 listenport=* listenaddress=0.0.0.0
    - 代表所有端口，0.0.0.0为所有ip



信札拆封谁为难 不过寥寥数行
娟秀字迹温柔 却感伤
你将心事 上了淡妆
该说的话 却被仔细收藏
暮色望垂杨 拱桥粼粼月光
忆往事我走笔 也阑珊
红颜如霜 凝结了过往
芦苇花开岁已寒 若霜又降路遥漫长
墙外是谁在吟唱 凤求凰
梨园台上 西皮二黄
却少了你 无人问暖
谁在彼岸 天涯一方
一句甚安勿念 你说落笔太难
窗外古琹幽兰 琴声平添孤单
我墨走了几行 泪潸然落了款
思念徒留纸上 一整篇被晕染
一句甚安勿念 你说落笔太难u
何故远走潇湘 你却语多委婉
走过萧瑟秋凉 等来芒草催黄
而我遥望轻轻叹
信札拆封谁为难 不过寥寥数行
娟秀字迹温柔 却感伤
你将心事 上了淡妆
该说的话 却被仔细收藏
捎来的他乡 到底隔几条江
一封信到底转了 几道弯
缘分飘落 在山外山
芦苇花开岁已寒 若霜又降路遥漫长
墙外是谁在吟唱 凤求凰
梨园台上 西皮二黄
却少了你 无人问暖
谁在彼岸 天涯一方
一句甚安勿念 你说落笔太难
窗外古琹幽兰 琴声平添孤单
我墨走了几行 泪潸然落了款
思念徒留纸上 一整篇被晕染
一句甚安勿念 你说落笔太难
何故远走潇湘 你却语多委婉
走过萧瑟秋凉 等来芒草催黄
而我遥望轻轻叹
一句甚安勿念 你说落笔太难
你说落笔太难
窗外古琹幽兰 琴声平添孤单
琴声平添孤单
我墨走了几行 泪潸然落了款
泪潸然落了款
思念徒留纸上 一整篇被晕染
一句甚安勿念 你说落笔太难
何故远走潇湘 你却语多委婉
走过萧瑟秋凉 等来芒草催黄
而鱼雁不再往返 [1] 

###########最伟大的作品 周杰伦################################################################

哥穿着复古西装

拿着手杖弹着魔法乐章

漫步走在萨玛莉丹 被岁月翻新的时光

望不到边界的帝国

用音符筑起的王座

我用琴键穿梭1920错过的不朽

啊 偏执是那马克利特

被我变出的苹果

超现实的是我

还是他原本想画的小丑

不是烟斗的烟斗

脸上的鸽子没有飞走

请你记得

他是个画家不是什么调酒

达利翘胡是谁给他的思索

弯了汤匙借你灵感不用还我

融化的是墙上时钟还是乳酪

龙虾电话那头你都不回我

浪荡是世俗画作里最自由不拘的水墨

花都优雅的双腿是这宇宙笔下的一抹

漂洋过海的乡愁种在一无所有的温柔

寂寞的枝头才能长出常玉要的花朵

小船静静往返

马谛斯的海岸
 
星空下的夜晚

交给梵谷点燃

梦美的太短暂

孟克桥上呐喊

这世上的热闹

出自孤单

 

花园流淌的阳光

空气摇晃着花香

我请莫内帮个忙

能不能来张自画像

大师眺望着远方

研究色彩的形状

突然回头要我说说

我对我自己的印象

世代的狂

音乐的王

万物臣服在我乐章

路还在闯

我还在创

指尖的旋律在渴望

世代的狂

音乐的王

我想我不需要画框

它框不住琴键的速度

我的音符全部是未来艺术

日出在印象的港口来回

光线唤醒了睡着的花叶

草地正为一场小雨欢悦

我们彼此深爱这个世界

停在康桥上的那只蝴蝶

飞往午夜河畔的翡冷翠

遗憾被偶然藏在了诗页

是微笑都透不进的世界

巴黎的鳞爪

感伤的文法

要用音乐翻阅

晚风的灯下

旅人的花茶

我换成了咖啡

之后他就

爱上了苦涩这个复杂词汇

因为这才是挥手

向云彩道别的滋味

小船静静往返

马谛斯的海岸

星空下的夜晚

交给梵谷点燃

梦美的太短暂

孟克桥上呐喊

这世上的热闹

出自孤单 作者：尚鎏 https://www.bilibili.com/read/cv17434970 出处：bilibili