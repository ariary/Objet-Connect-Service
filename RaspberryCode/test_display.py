try:
    import tkinter as Tk
except:
    import Tkinter as Tk
from PIL import Image
import os

 
root = Tk.Tk()
#fullscreen
root.attributes('-fullscreen', 1)

#resize
im_temp = Image.open("bad.gif").convert('RGB')
im_temp = im_temp.resize((250, 250), Image.ANTIALIAS)
im_temp.save("tmp.ppm", "ppm")
photo = Tk.PhotoImage(file="tmp.ppm")
panel = Tk.Label(root, image = photo)
panel.pack()
os.remove("tmp.ppm") #supprime le fichier .ppm

#bouton quit
button = Tk.Button(root, text="Quit", command=root.destroy)
button.pack(side="top")
root.mainloop()


#photo = Tk.PhotoImage(file=r"bad.gif")
# canvas = Tk.Canvas(root,width=350, height=200)
# canvas.create_image(0, 0, image=photo)
# canvas.pack()