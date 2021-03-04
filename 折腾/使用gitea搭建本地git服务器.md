# 使用gitea搭建本地git服务器

## 前言
- 怎么在本地搭建一个本地的`git`服务器，接下来就一起来折腾折腾;
- 这次使用gitea搭建本地服务器，需要使用的工具如下：
  + git [git下载](https://git-scm.com/downloads)
  + MySQL本地服务 [MySQL下载](https://www.mysql.com/downloads/)
  + gitea [gitea下载](https://dl.gitea.io/gitea)
- 要成功搭建`git`服务器，需要安装`git`和数据库软件，这次使用的数据库软件是`MySQL`;
- 安装`git`和`MySQL`不做演示，留个坑后面补上。

## 下载gitea
打开前言中`gitea`的下载地址，选择版本、选择对应平台的安装包，我这里下载的是`1.13.2 Windows 64位`的安装包；
![gitea下载](https://note.youdao.com/yws/api/personal/file/6A39E8A9DB844A57A917DE0B76F1011A?method=download&shareKey=bd8e4e74e8321394e56b2257afe0f818)
![gitea下载](https://note.youdao.com/yws/api/personal/file/87DD6C277F154DF79A89679519863AFA?method=download&shareKey=edcfd7bd5839862d8943df95c2a2b788)

## 安装gitea
1. 在D盘中新建文件夹`gitea`，将安装包放在该文件加下；
2. 以管理员身份运行安装包，如果电脑没有安装`git`这一步会报错；
3. 在浏览器中打开`http://12.0.0.1:3000`这个地址，开始配置`git`服务器。
![安装目录](https://note.youdao.com/yws/api/personal/file/217A0F47FD9B421B93E1E410D11E153E?method=download&shareKey=10f94bcade63c4d94217be7793f87bef)
![运行安装包](https://note.youdao.com/yws/api/personal/file/759364C3701D4682835D98C797783254?method=download&shareKey=2a58e18ebc737a6e59aca1707f477858)

## 配置git服务器
1. 在浏览器中打开`http://12.0.0.1:3000`进入首页；
2. 点击首页注册按钮，会跳转到初始化配置页面；
3. 填写配置信息立即安装，会跳转进入注册页面
![首页](https://note.youdao.com/yws/api/personal/file/C7E63B30D368420E8DBC57C70BBB3BB3?method=download&shareKey=ac668247919085bd2203cf1f88673a7f)
![数据库配置](https://note.youdao.com/yws/api/personal/file/ACD3BE6E525F47F28346B2BE21E6DD79?method=download&shareKey=a0d02d37420be76d0435e7c5332551bb)
![一般配置](https://note.youdao.com/yws/api/personal/file/79F64EB1512D49C99D3357977198C99B?method=download&shareKey=f166077958a7362c797bb9147d58d33c)
![可选配置](https://note.youdao.com/yws/api/personal/file/06E50F494FB4470E8C3399665041AF82?method=download&shareKey=be881965464c4c4730e26dd2982196a4)

## 注册用户
填写注册信息，立即注册
![注册页面](https://note.youdao.com/yws/api/personal/file/C1DE0A52B7D541EA99CF49E6A1E6C9F5?method=download&shareKey=0d2215bd053f60b1fa6050aa5222e472)


## 登录
注册成功就可以登录了，用户界面是中文的，简单友好
![登录页面](https://note.youdao.com/yws/api/personal/file/FC399C20FDD8450C8C455DC92CC029AF?method=download&shareKey=bdf752fc2d6afdad1283044729a1a72c)
![用户首页](https://note.youdao.com/yws/api/personal/file/36643D813B3147F281BA06D683F15C4D?method=download&shareKey=01c2b06a4dc0b2c94695d0d8340900c2)

## 将gitea注册为windows服务
至此已经完成了`git`服务器的搭建，但是现在每次重启电脑后都要重新启动服务比较麻烦；可以通过将`gitea`注册为windows服务的方式解决这个问题。
1. 以**管理员身份**启动命令行；
2. 使用`sc delete gitea`命令，删除`gitea`服务；
3. 使用`sc create gitea start= auto binPath= "\"d:\gitea\gitea-1.13.2-windows-4.0-amd64.exe\" web --config \"d:\gitea\custom\conf\app.ini\""`设置服务；
4. 设置`gitea`服务启动类型为**自动（延迟启动）**，下次电脑开机过一会就会自动启动这个服务。
![删除服务](https://note.youdao.com/yws/api/personal/file/69B9F8C7ADFC41ABBC93C8F3602896DE?method=download&shareKey=399ab0de0880430a6ab9fa4ee160fa38)
![设置服务](https://note.youdao.com/yws/api/personal/file/8CFB9E77564A4EE096DF4E8B5B92F29C?method=download&shareKey=421b7a9c89846dd6f84537fc62b9d1bb)
![windows服务页面](https://note.youdao.com/yws/api/personal/file/B54E93278AAA4220AC5D325FFFEB1048?method=download&shareKey=e7885e78692e4de4df7de705a86b7344)
![设置gitea服务属性](https://note.youdao.com/yws/api/personal/file/2B90CC17D98F4B03925DA3041AF2FD30?method=download&shareKey=6e16c4f0c78f7788d52eee36dddcd30b)

## 总结
至此使用`gitea`搭建本地服务已经完成，动手折腾一番收获颇丰。
