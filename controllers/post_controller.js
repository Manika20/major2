const Post = require('../model/post')
const Comment = require('../model/comment');
const Like = require('../model/like');

module.exports.create = async function(req,res)
{
   try{
      let post = await Post.create({
         content:req.body.content,
         user:req.user._id
  })
  let post_ = await post.populate(['user , likes']);
  if(req.xhr)
  {
   //console.log("00");
   return res.status(200).json(
      {
         data:
         {
            post:post_
         },
         message:"Post Created!!"
      }
   )
  }
  req.flash('success','Post published!!');
  return res.redirect('back');
   }
   catch(err)
   {
      req.flash('error',err);
      return res.redirect('back');
   }
     
}
module.exports.destroy= async function(req,res)
{
   try{
      let post= await Post.findById(req.params.id)
       //.id converts _id into string
      // we are not populating so post.user wl return string id
      if(post.user = req.user.id)
      {
         await Like.deleteMany({likeable:post , onModel:'Post'});
         await Like.deleteMany({_id:{$in:post.comments}});
         post.remove();
         await Comment.deleteMany({post:req.param.id})
         if(req.xhr)
         {
          console.log('00');
          return res.status(200).json(
             {
                data:
                {
                   post_id :req.params.id
                },
                message:"deleted!!"
             })
          }
       
         //req.flash('success','Post deleted');
         return res.redirect('back');
      }
      else
      {
         req.flash('error','You are not authorize to delete this post');
         return res.redirect('back');
      }
     
   }catch(err)
   {
      req.flash('error',err);
      return res.redirect('back');
   }
      
   }