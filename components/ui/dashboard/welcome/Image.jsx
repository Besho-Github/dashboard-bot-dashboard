'use client';
import { useState, useEffect, useContext } from 'react';
import { api } from '../../../../utils/api';
import List from './List';
import Avatar from './Avatar';
import { TRANSPARENT, getDimensions } from '../../../../utils';
import Switch from '../common/Switch';
import { Stage, Layer, Text, Image as KonvaImage } from 'react-konva';
import Transformer from './Transformer';
import UserName from './UserName';
import WelcomeText from './WelcomeText';
import { createCircle } from './Shapes';
import { DataContext } from '../../../../context';
import imageCompression from 'browser-image-compression';
import { Icon } from '@iconify/react';
import { GuildDataContext } from '../../../../context/guild';

export function WelcomeImage({ state, handleSwitchChange, handleBackgroundChange, handleElementChange }) {
  const [image, setImage] = useState(null);
  const [shapes, setShapes] = useState({
    circle: null,
    square: null,
  });

  const [selectedShapeName, setSelectedShapeName] = useState('');
  const [activeList, setActiveList] = useState('Background');
  const { locale } = useContext(DataContext);
  const { guild } = useContext(GuildDataContext);
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const avatar = await new Promise((resolve, reject) => {
          const img = new Image();
          img.src = '/avatar.png';
          img.onload = () => resolve(img);
          img.onerror = reject; // Handle errors
        });

        const avatarCircle = new Image();
        avatarCircle.src = createCircle(avatar);

        setShapes({
          square: avatar,
          circle: avatarCircle,
        });
      } catch (error) {
        console.error('Failed to load avatar image', error);
      }
    };

    loadAvatar();
  }, []);

  useEffect(() => {
    const img = new window.Image();
    img.src = state.background.image_url?.replace('media.wicks.bot', process.env.MEDIA_DOMAIN) || TRANSPARENT;
    img.onload = () => {
      setImage(img);
    };
  }, [state.background.image_url]);

  const handleDragEnd = (e, element) => {
    handleElementChange(element, {
      position: {
        left: Number(parseFloat(e.target.x()).toFixed(2)),
        top: Number(parseFloat(e.target.y()).toFixed(2)),
      },
    });
  };

  const handleTransformEnd = (e, element) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    const data = {
      position: {
        left: Number(parseFloat(node.x()).toFixed(2)),
        top: Number(parseFloat(node.y()).toFixed(2)),
      },
      size: {
        width: Number(parseFloat(Math.max(5, node.width() * scaleX)).toFixed(2)),
        height: Number(parseFloat(Math.max(5, node.height() * scaleY)).toFixed(2)),
      },
    };
    if (['name', 'welcome_text'].includes(element)) {
      delete data.size.height;
      data.size.font_size = Number(parseFloat(e.target.getFontSize() * scaleY).toFixed(2));
    }
    handleElementChange(element, data);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Convert to PNG if not already in PNG format
        let processedFile = file;

        if (file.type !== 'image/png') {
          const canvas = document.createElement('canvas');
          const img = await createImageBitmap(file);

          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
          processedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.png'), { type: 'image/png' });
        }

        let compressedFile = processedFile;

        // Check if the file size is greater than 2MB
        if (processedFile.size > 2 * 1024 * 1024) {
          const options = {
            maxSizeMB: 2, // Maximum size in MB
            maxWidthOrHeight: 1920, // Optional: maximum width or height (in pixels)
            useWebWorker: true, // Optional: use web worker for faster compression
          };

          // Compress the image
          compressedFile = await imageCompression(processedFile, options);
        }

        const formData = new FormData();
        formData.append('image', compressedFile);

        // Upload the image
        const response = await api.post(`/guilds/${guild.id}/upload-image`, formData);
        const imageUrl = response.data.url;

        const Background = new window.Image();
        Background.src = URL.createObjectURL(compressedFile);
        Background.onload = () => {
          const dimensions = getDimensions(Background.width, Background.height);
          handleBackgroundChange(imageUrl, dimensions);
        };
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  };

  const handleRemoveBackground = () => {
    handleBackgroundChange('', { width: 500, height: 250 });
  };

  return (
    <div className="flex flex-col gap-6 my-5">
      {/* Main Image Section */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/10 p-2 rounded-lg">
              <Icon icon="mdi:image" className="text-indigo-400 w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-gray-100 uppercase">{locale.welcome.sec_1.title}</h2>
          </div>
          <Switch size="sm" active={state.image.enabled} onChange={() => handleSwitchChange('image')} />
        </div>

        {/* Canvas Stage Container */}
        <div className="flex justify-center items-center rounded-lg p-4">
          <Stage width={state.background.size.width} height={state.background.size.height}>
            <Layer>
              <KonvaImage
                image={image}
                name="backgroundImage"
                onClick={() => {
                  setSelectedShapeName('');
                }}
                onTap={() => {
                  setSelectedShapeName('');
                }}
                width={state.background.size.width}
                height={state.background.size.height}
              />
              <KonvaImage
                image={shapes[state.avatar.shape]}
                name="avatar"
                onClick={(e) => {
                  setSelectedShapeName(e.target.name());
                }}
                onTap={(e) => {
                  setSelectedShapeName(e.target.name());
                }}
                x={state.avatar.position.left}
                y={state.avatar.position.top}
                width={state.avatar.size.width}
                height={state.avatar.size.height}
                draggable
                onDragEnd={(e) => handleDragEnd(e, 'avatar')}
                onTransformEnd={(e) => handleTransformEnd(e, 'avatar')}
              />
              <Text
                text={'UserName'}
                name="username"
                shadowOffset={{ x: 2, y: 2 }}
                shadowColor="#000"
                x={state.name.position.left}
                y={state.name.position.top}
                fontSize={state.name.size.font_size}
                height={state.name.size.height}
                width={state.name.size.width}
                fill={state.name.color}
                ellipsis={true}
                scaleX={1}
                scaleY={1}
                wrap="none"
                draggable
                onClick={(e) => {
                  setSelectedShapeName(e.target.name());
                }}
                onTap={(e) => {
                  setSelectedShapeName(e.target.name());
                }}
                onDragEnd={(e) => handleDragEnd(e, 'name')}
                onTransformEnd={(e) => handleTransformEnd(e, 'name')}
              />
              {state.welcome_text.enabled ? (
                <Text
                  text={state.welcome_text.content}
                  name="welcome_text"
                  shadowOffset={{ x: 2, y: 2 }}
                  shadowColor="#000"
                  x={state.welcome_text.position.left}
                  y={state.welcome_text.position.top}
                  fontSize={state.welcome_text.size.font_size}
                  height={state.welcome_text.size.height}
                  width={state.welcome_text.size.width}
                  fill={state.welcome_text.color}
                  ellipsis={true}
                  scaleX={1}
                  scaleY={1}
                  wrap="none"
                  draggable
                  onClick={(e) => {
                    setSelectedShapeName(e.target.name());
                  }}
                  onTap={(e) => {
                    setSelectedShapeName(e.target.name());
                  }}
                  onDragEnd={(e) => handleDragEnd(e, 'welcome_text')}
                  onTransformEnd={(e) => handleTransformEnd(e, 'welcome_text')}
                />
              ) : (
                ''
              )}
              <Transformer selectedShapeName={selectedShapeName} />
            </Layer>
          </Stage>
        </div>
        <List active={activeList} onChange={(e) => setActiveList(e)} />
        {activeList === 'Background' && (
          <div className="p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <input type="file" id="backgroundImageInput" className="hidden" accept="image/*" onChange={handleFileChange} />
                <label
                  htmlFor="backgroundImageInput"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-4 py-2 bg-[#1D1B45] rounded-lg cursor-pointer hover:bg-[#25235b] transition-colors"
                >
                  <img src={'/AddImage.svg'} className="w-5 h-5" alt="Upload icon" />
                  <span className="text-sm font-medium text-gray-300">{locale.welcome.sec_2.choose}</span>
                </label>

                <button
                  onClick={handleRemoveBackground}
                  className="w-full sm:w-auto text-center px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                >
                  {locale.welcome.remove}
                </button>
              </div>

              <div className="text-xs text-gray-400">Recommended size: 1024x360px (PNG)</div>
            </div>
          </div>
        )}

        {activeList === 'Avatar' && <Avatar state={state} handleElementChange={handleElementChange} />}
        {activeList === 'Username' && <UserName state={state} handleElementChange={handleElementChange} />}
        {activeList === 'Text' && <WelcomeText state={state} handleElementChange={handleElementChange} />}
      </div>
    </div>
  );
}
