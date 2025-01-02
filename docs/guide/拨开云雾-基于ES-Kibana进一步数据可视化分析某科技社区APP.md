
#### 前期工作
1.**部署Elasticsearch**
>路径位置 /usr/share/elasticsearch
>配置文件 /etc/elasticsearch/elasticsearch.yml
>启动ES 
1）service elasticsearch start
2) /usr/share/elasticsearch/bin/elasticsearch -d (守护进程方式，后台持久化运行)
<!-- more -->

2. **部署Kibana**
>路径位置 /usr/share/kibana
>配置文件 /etc/kibana/kibana.yml
>启停Kibana
service kibana start/stop
ps -ef | grep kibana
#### 遇到的问题及解决方法
1.**Elasticsearch:7.6.0启动失败，ERROR: [1] bootstrap checks failed**

>解决方法：
1）临时通行：在启动命令中添加 -e "discovery.type=single-node" 设置ES为单主机模式
2）永久生效：在ES的配置yml中加入上述命令，并重新启动ES以保持永久生效。
2.**用户权限问题**
无论是es还是kibana在启动过程中均可能遇到用户权限不足的问题，但这是实测不能切换到root用户，而是必须要切换到程序专属的elastic用户
**su elastic**
**./elasticsearch -d -E "discovery.type=single-node"**
#### 命令行查询测试
```
curl -H "Content-Type: application/json" -XPUT --user elastic:xxxxxx 'http://localhost:9200/_settings' -d '
{
     "index" : {
        "number_of_replicas" : 0
     }
}'
```
#### 实战：APP数据转化到ES索引并插入数据

```python
from elasticsearch import Elasticsearch, helpers #引入helpers对象提供es批量插入接口
def insert_data(app_data_list):
    data_list = []
    for item in app_data_list:
        info = {
            "_index": "cool_data",
            "_source": {
                # 用户id
                "author_user_id": item.user_id,              
                # 性别
                "gender": item.gender,
                # 昵称
                "nickname": item.nickname,
                # 归属地
                "region": item.region,
                # 用户发表内容
                "ueer_content": item.ueer_content,
                # 内容创建时间
                "create_time": handle_date(a1=(item.creat_time, key="ims"),
                # 设备IP
                "device_ip": item.device_ip,
                # 抓取时间
                "crawl_time": handle_date(item.craw_time, key="cms"),             
                # 手机型号
                "user_phone": item.user_phone,
                 # 标签
                "tag": item.tag
            }
        }
        # print(info)
        data_list.append(info)
    # 通过helpers插入数据
    helpers.bulk(es, data_list)
```
##### 分离两种情况,时间处理函数,判断抓取时间和内容创建时间
```python
from elasticsearch import Elasticsearch, helpers #引入helpers对象提供es批量插入接口
def insert_data(app_data_list):
    data_list = []
    for item in app_data_list:
        info = {
            "_index": "cool_data",
            "_source": {
                # 用户id
                "author_user_id": item.user_id,              
                # 性别
                "gender": item.gender,
                # 昵称
                "nickname": item.nickname,
                # 归属地
                "region": item.region,
                # 用户发表内容
                "ueer_content": item.ueer_content,
                # 内容创建时间
                "create_time": handle_date(a1=(item.creat_time, key="ims"),
                # 设备IP
                "device_ip": item.device_ip,
                # 抓取时间
                "crawl_time": handle_date(item.craw_time, key="cms"),             
                # 手机型号
                "user_phone": item.user_phone,
                 # 标签
                "tag": item.tag
            }
        }
        # print(info)
        data_list.append(info)
    # 通过helpers插入数据
    helpers.bulk(es, data_list)
```
##### 根据不同维度，角度生成可视化图表

![4f7a82ce87d989cc1773ba867f3a5f3](https://i.loli.net/2021/08/04/SLXYf1ijTngEslq.png)

![20210804112340](https://i.loli.net/2021/08/04/HE5rWSkl4VYh7Xa.png)

通过Es图表数据可以看到 每天抓取数据 频率在一定时间保持在一个稳定频率，程序运行稳定。

性别和年龄对比，以男性占多，

手机型号统计 国内厂商占大多数 容量大小方面，8+128g为绝对主流。
**未完待续。。。**

