document.getElementById('btnExtract').addEventListener('click', async ()=>{
  const f = document.getElementById('fileInput').files[0];
  if(!f){ alert('Chọn file trước'); return; }
  const fd = new FormData();
  fd.append('file', f);
  document.getElementById('fileInfo').innerText = 'Đang gửi file...';
  const res = await fetch('/api/upload', { method:'POST', body: fd });
  const data = await res.json();
  if(data.error){ alert('Lỗi: ' + data.error); return; }
  document.getElementById('preview').innerText = data.text;
  if(data.fields){
    if(data.fields.project_name) document.getElementById('project').value = data.fields.project_name;
    if(data.fields.client) document.getElementById('client').value = data.fields.client;
    if(data.fields.location) document.getElementById('location').value = data.fields.location;
    if(data.fields.scale) document.getElementById('scale').value = data.fields.scale;
  }
  document.getElementById('fileInfo').innerText = 'Extract xong';
});

document.getElementById('btnGenerate').addEventListener('click', async ()=>{
  const content = document.getElementById('preview').innerText || '';
  const meta = {
    project_name: document.getElementById('project').value,
    client: document.getElementById('client').value,
    location: document.getElementById('location').value,
    scale: document.getElementById('scale').value,
    project_short: (document.getElementById('project').value||'Project').replace(/\s+/g,'_').replace(/[^A-Za-z0-9_]/g,'').slice(0,30)
  };
  const body = { content, meta };
  const res = await fetch('/api/generate', {
    method:'POST',
    headers:{ 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if(res.ok){
    const blob = await res.blob();
    const disposition = res.headers.get('content-disposition') || '';
    let filename = 'UyViet_GiaiPhap.docx';
    try{
      const cd = disposition.split('filename=')[1];
      if(cd) filename = cd.replace(/\"/g,'').trim();
    }catch(e){}
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    window.URL.revokeObjectURL(url);
  } else {
    const err = await res.json();
    alert('Lỗi: ' + JSON.stringify(err));
  }
});

document.getElementById('btnDownloadExcel').addEventListener('click', ()=>{
  window.location = '/api/download_tools';
});
