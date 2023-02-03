# get all file names in directory

import os


def get_file_names(path):
    file_names = []
    for file in os.listdir(path):
        if os.path.isfile(os.path.join(path, file)) and file.endswith(".jpg"):
            file_names.append(file)
    return file_names


def save(file_names):
    with open('file_names.txt', 'w') as f:
        for file_name in file_names:
            f.write("<div class='gallery-image'>")
            f.write("<img src='images/my_gallery/{0}' title='{1}' alt='{1}'>".format(
                file_name, " ".join(file_name[:-4].split("_"))))
            f.write("</div>\n")


if __name__ == '__main__':
    path = 'toupload\images\my_gallery'
    file_names = get_file_names(path)
    save(file_names)
