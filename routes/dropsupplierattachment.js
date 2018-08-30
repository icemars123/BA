// TODO: Send both uuid and fguid - to make sure it's a current session and correct user..
// OR just send fguid since we can reverse lookup uuid etc from that and keeps things anonymous over the wire...
exports.dropSupplierAttachmentPost = function(req, res)
{
  var jsonobj = {message: 'Error writing file'};
  //
  if (!__.isUndefined(req.body) && !__.isNull(req.body))
  {
    if (!__.isUndefined(req.body.supplierid) && !__.isNull(req.body.supplierid))
    {
      if (!__.isUndefined(req.files) && !__.isUndefined(req.files.file))
      {
        global.modsuppliers.newSupplierAttachment
        (
          {
            filename: req.files.file.originalFilename,
            supplierid: req.body.supplierid,
            uuid: req.body.uuid,
            description: req.body.description,
            mimetype: req.files.file.type,
            size: req.files.file.size
          },
          function(err, id)
          {
            if (!err)
            {
              var filename = global.path.join(__dirname, global.config.folders.clientattachments + id + '_' + req.body.supplierid + '_' + req.files.file.originalFilename);
              //
              global.fs.rename
              (
                req.files.file.path,
                filename,
                function(err)
                {
                  if (!err)
                  {
                    // Remove original file if still there...
                    global.fs.unlink
                    (
                      req.files.file.path,
                      function()
                      {
                        if (!err)
                          jsonobj = {id: id, filename: req.files.file.originalFilename};
                        res.json(jsonobj);
                      }
                    );
                  }
                  else
                    res.json(jsonobj);
                }
              );
            }
            else
              res.json(jsonobj);
          }
        );
      }
    }
    else
      res.json({message: 'No file to upload'});
  }
  else
    res.json({message: 'No form to upload'});
};
