

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



