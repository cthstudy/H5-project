<?php
    /**
     * Created by PhpStorm.
     * User: Administrator
     * Date: 2018\11\29 0029
     * Time: 13:24
     */
    
        //添加商品
    
//            $pro_cat = M('product_catgory');
//            $pro_cat = $pro_cat->select();
//            $pro_cat = findson($pro_cat,0,0);
//            //print_r($pro_cat);die;
            if($_POST){
                print_r($_FILES);
                print_r($_POST);die;
                $product = M('product');
                if ($_FILES['upfile']['name'][0] == "") {
                    exit("请上传文件！");
                }//判断第一个文件名是否为空
                //$dir = dirname(dirname(dirname(dirname(__FILE__)))).'/Public/Image/images/';
                $dir = $_SERVER['DOCUMENT_ROOT']."/TP/Public/Image/images/";
                //echo substr($dir,strpos($dir,'/TP'));die;
                if (!is_dir($dir)) {
                    mkdir($dir);
                }        //路径不存在 创建路径
                $upfile = $_FILES['upfile'];
                //print_r($upfile);die();
                $types = array("png", "jpg", "webp", "jpeg", "gif");  //声明支持的文件类型
                for ($i = 0; $i < count($upfile['name']); $i++) {
                    $name = $upfile['name'][$i];  //在循环中取得每次要上传的文件名
                    //echo $name;die();
                    $end = explode(".", $name);
                    //print_r($end);die();
                    $type = strtolower(end($end)); //在循环中取得每次要上传的文件类型
                    if (!in_array($type, $types)) {
                        echo "第" . ($i + 1) . "个文件类型错误<br/>";
                    } else {
                        $error = $upfile['error'][$i];  //在循环中取得每次要上传的文件的错误情况
                        if ($error != 0) {
                            echo "第" . ($i + 1) . "个文件上传错误<br/>";
                        } else {
                            $tmp_name = $upfile['tmp_name'][$i];//在循环中取得每次要上传的文件的临时文件
                            if (!is_uploaded_file($tmp_name)) {
                                echo "第" . ($i + 1) . "个文件临时文件错误<br/>";
                            } else {
                                $newname = $dir.date("YmdHis") . rand(1, 10000) . "." . $type;
                                $img_array[$i] = substr($newname,strpos($newname,'/TP'));
                                //在循环中给每个文件一个新名称
                                if (!move_uploaded_file($tmp_name, $newname)) {  //对每个临时文件执行上传操作
                                    echo "第" . ($i + 1) . "个文件上传失败<br/>";
                                }
//                                else {
//                                    echo "第" . ($i + 1) . "个文件上传成功<br/>";
//
//                                }
                            }
                        }
                    }
                }
                //print_r($img_array);die;
                $img_array = json_encode($img_array);
                //$img_array = json_decode($img_array);
                //echo $img_array;
                //die;
                $data['name'] = $_POST['name'];
                $data['pid'] = $_POST['catgory'];
                $data['price'] = $_POST['price'];
                $data['img'] = $img_array;
                $data['desc'] = $_POST['desc'];
                $data['stock'] = $_POST['stock'];
                $data['status'] = $_POST['status'];
                $data['add_time'] = date('Y-m-d H:i:s', time());
                $data['last_time'] = date('Y-m-d H:i:s', time());
                $res = $product->add($data);
                if($res != false){
                    $arr = [
                        'status'=>'1',
                        'content'=>'商品添加成功'
                    ];
                    echo json_encode($arr);
                    exit;
                }else{
                    $arr = [
                        'status'=>'2',
                        'content'=>'商品添加失败'
                    ];
                    echo json_encode($arr);
                    exit;
                }
            }else{
                $this->assign('list',$pro_cat);
                $this->display();
            }
    
    
    
    //编辑商品
//
//    if($_POST){
//        //print_r($_FILES);
//        //print_r($_POST);die;
//        //如果没有新图片上传，只是编辑原来的图片
//        if(empty($_FILES)){
//            $img = explode(",",$_POST['result']);
//            $img_old = $product->where('id='.$_POST['id'])->find();
//            $img_old['img'] = json_decode($img_old['img']);
//            //print_r($img_old['img']);die;
//            foreach ($img_old['img'] as $key=>$value){
//                if(!in_array($value,$img)){
//                    unlink($_SERVER['DOCUMENT_ROOT'].$value);
//                }
//            }
//            $data['img'] = json_encode($img);
//            $data['name'] = $_POST['name'];
//            $data['pid'] = $_POST['catgory'];
//            $data['price'] = $_POST['price'];
//            $data['desc'] = $_POST['desc'];
//            $data['stock'] = $_POST['stock'];
//            $data['status'] = $_POST['status'];
//            $data['last_time'] = date('Y-m-d H:i:s', time());
//            $res = $product->where('id='.$_POST['id'])->data($data)->save();
//            if($res != false){
//                $msg = [
//                    'status'=>'1',
//                    'msg'=>'编辑成功'
//                ];
//                echo json_encode($msg);
//                exit;
//            }else{
//                $msg = [
//                    'status'=>'2',
//                    'msg'=>'编辑失败'
//                ];
//                echo json_encode($msg);
//                exit;
//            }
//        }else{
//            //如果有新的图片上传
//            if ($_FILES['upfile']['name'][0] == "") {
//                exit("请上传文件！");
//            }//判断第一个文件名是否为空
//            //$dir = dirname(dirname(dirname(dirname(__FILE__)))).'/Public/Image/images/';
//            $dir = $_SERVER['DOCUMENT_ROOT']."/TP/Public/Image/images/";
//            //echo substr($dir,strpos($dir,'/TP'));die;
//            if (!is_dir($dir)) {
//                mkdir($dir);
//            }        //路径不存在 创建路径
//            $upfile = $_FILES['upfile'];
//            //print_r($upfile);die();
//            $types = array("png", "jpg", "webp", "jpeg", "gif");  //声明支持的文件类型
//            for ($i = 0; $i < count($upfile['name']); $i++) {
//                $name = $upfile['name'][$i];  //在循环中取得每次要上传的文件名
//                //echo $name;die();
//                $end = explode(".", $name);
//                //print_r($end);die();
//                $type = strtolower(end($end)); //在循环中取得每次要上传的文件类型
//                if (!in_array($type, $types)) {
//                    echo "第" . ($i + 1) . "个文件类型错误<br/>";
//                } else {
//                    $error = $upfile['error'][$i];  //在循环中取得每次要上传的文件的错误情况
//                    if ($error != 0) {
//                        echo "第" . ($i + 1) . "个文件上传错误<br/>";
//                    } else {
//                        $tmp_name = $upfile['tmp_name'][$i];//在循环中取得每次要上传的文件的临时文件
//                        if (!is_uploaded_file($tmp_name)) {
//                            echo "第" . ($i + 1) . "个文件临时文件错误<br/>";
//                        } else {
//                            $newname = $dir.date("YmdHis") . rand(1, 10000) . "." . $type;
//                            $img_array[$i] = substr($newname,strpos($newname,'/TP'));
//                            //在循环中给每个文件一个新名称
//                            if (!move_uploaded_file($tmp_name, $newname)) {  //对每个临时文件执行上传操作
//                                echo "第" . ($i + 1) . "个文件上传失败<br/>";
//                            }
////                                else {
////                                    echo "第" . ($i + 1) . "个文件上传成功<br/>";
////
////                                }
//                        }
//                    }
//                }
//            }
//            //print_r($img_array);die;
//            //循环中unlink掉在前台删除的对应的服务器中的图片
//            if(!empty($_POST['result'])){
//                $img = explode(",",$_POST['result']);
//                $img_old = $product->where('id='.$_POST['id'])->find();
//                $img_old['img'] = json_decode($img_old['img']);
//                //print_r($img_old['img']);die;
//                foreach ($img_old['img'] as $key=>$value){
//                    if(!in_array($value,$img)){
//                        unlink($_SERVER['DOCUMENT_ROOT'].$value);
//                    }
//                }
//                //合并处理过图片和新上传图片的数组
//                $img_array = array_merge($img,$img_array);
//                //print_r($img_array);die;
//            }else{
//                $img_old = $product->where('id='.$_POST['id'])->find();
//                $img_old['img'] = json_decode($img_old['img']);
//                foreach ($img_old['img'] as $key=>$value){
//                    unlink($_SERVER['DOCUMENT_ROOT'].$value);
//                }
//            }
//            $img_array = json_encode($img_array);
//            //$img_array = json_decode($img_array);
//            //echo $img_array;
//            //die;
//            $data['name'] = $_POST['name'];
//            $data['pid'] = $_POST['catgory'];
//            $data['price'] = $_POST['price'];
//            $data['img'] = $img_array;
//            $data['desc'] = $_POST['desc'];
//            $data['stock'] = $_POST['stock'];
//            $data['status'] = $_POST['status'];
//            $data['last_time'] = date('Y-m-d H:i:s', time());
//            $res = $product->where('id='.$_POST['id'])->data($data)->save();
//            if($res != false){
//                $arr = [
//                    'status'=>'1',
//                    'msg'=>'编辑成功'
//                ];
//                echo json_encode($arr);
//                exit;
//            }else{
//                $arr = [
//                    'status'=>'2',
//                    'msg'=>'编辑成功'
//                ];
//                echo json_encode($arr);
//                exit;
//            }
//        }
//
//    }else{
//        $this->assign('list',$list);
//        $this->assign('list_cat',$pro_cat);
//        $this->assign('pid',$pid);
//        $this->assign('img',$list['img']);
//        $this->assign('id',$_GET['id']);
//        $this->display();
//    }

        
    
    