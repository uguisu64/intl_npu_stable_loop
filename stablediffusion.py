from diffusers import StableDiffusionPipeline
import intel_npu_acceleration_library
import torch
import eel
import random
import base64
from io import BytesIO

gen_flg = False
gen_list = None

pipe = StableDiffusionPipeline.from_pretrained("stablediffusionapi/anything-v5").to("cpu")
pipe.reqires_safety_checker = False
pipe.safety_checker = None
text_encoder = pipe.text_encoder
text_encoder.eval()
unet = pipe.unet
unet.eval()
vae = pipe.vae
vae.eval()

text_encoder = intel_npu_acceleration_library.compile(text_encoder, dtype=torch.int8)
unet = intel_npu_acceleration_library.compile(unet, dtype=torch.int8)
vae = intel_npu_acceleration_library.compile(vae, dtype=torch.int8)

eel.init('web')

def gen_image():
    global gen_flg, gen_list
    while True:
        if gen_flg:
            prompt = ""
            for one_list in gen_list:
                prompt += str(random.choice(one_list)) + " ,"
            image = pipe(prompt,num_inference_steps=16).images[0]
            buffer = BytesIO()
            image.save(buffer, 'jpeg')
            base64_image = base64.b64encode(buffer.getvalue())
            eel.set_base64image("data:image/jpg;base64," + base64_image.decode("ascii"))
            eel.sleep(1)
        else:
            eel.sleep(1)


# JavaScriptからデータを受信するPython関数
@eel.expose
def receive_data(lists):
    global gen_flg, gen_list
    gen_list = lists
    gen_flg = True
    return "ok"

eel.spawn(gen_image)
# Eelサーバーを起動し、HTMLファイルを表示
eel.start('index.html')