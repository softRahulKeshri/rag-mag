import React from "react";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading...", 
  fullScreen = true 
}) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      {/* Background Effects for Full Screen */}
      {fullScreen && (
        <>
          {/* Animated Background Elements */}
          <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 via-purple-400/15 to-cyan-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
          <div
            className="absolute bottom-[-200px] right-[-150px] w-[600px] h-[600px] bg-gradient-to-br from-purple-400/20 via-pink-400/15 to-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-[30%] right-[15%] w-[300px] h-[300px] bg-gradient-to-br from-cyan-400/15 via-blue-400/10 to-purple-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Floating Geometric Shapes */}
          <div className="absolute top-[20%] left-[10%] w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg rotate-45 animate-float"></div>
          <div
            className="absolute bottom-[30%] left-[20%] w-12 h-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full animate-float"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute top-[60%] right-[25%] w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg rotate-12 animate-float"
            style={{ animationDelay: "2.5s" }}
          ></div>

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.03) 1px, transparent 0)`,
                backgroundSize: "60px 60px",
              }}
            ></div>
          </div>

          {/* Animated Light Rays */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-pulse"></div>
          <div
            className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          {/* Floating Particles */}
          <div className="absolute top-[15%] left-[15%] w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"></div>
          <div
            className="absolute top-[25%] right-[20%] w-1 h-1 bg-purple-400/40 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-[20%] left-[30%] w-1.5 h-1.5 bg-cyan-400/35 rounded-full animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-[35%] right-[10%] w-1 h-1 bg-pink-400/30 rounded-full animate-bounce"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </>
      )}

      {/* Main Loading Content */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Logo Container with Animation */}
        <div className="relative">
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rotate-slow"></div>
          
          {/* Middle Ring */}
          <div className="absolute inset-2 w-28 h-28 rounded-full bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-purple-500/30 rotate-reverse"></div>
          
          {/* Logo Container */}
          <div className="relative w-32 h-32 flex items-center justify-center bg-white/80 backdrop-blur-xl rounded-full shadow-2xl border border-white/20 animate-pulse-gentle logo-glow">
            {/* Magure AI Logo */}
            <div className="w-16 h-16 animate-float">
              <svg width="64" height="50" viewBox="0 0 93 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_7_126" style={{maskType:"luminance"}} maskUnits="userSpaceOnUse" x="0" y="0" width="93" height="72">
                  <path d="M0 0H93V72H0V0Z" fill="white"/>
                </mask>
                <g mask="url(#mask0_7_126)">
                  <path d="M81.425 4.48295V46.6209C81.4254 46.8314 81.3669 47.0377 81.2562 47.2166C81.1454 47.3956 80.9868 47.5399 80.7983 47.6335C80.6098 47.727 80.3989 47.7659 80.1895 47.7459C79.98 47.7258 79.7803 47.6475 79.613 47.5199L71.428 41.3069V18.8799C71.428 17.9579 70.377 17.4279 69.627 17.9799L55.16 28.9649L47.344 23.0289L75.572 1.59095C76.207 1.10583 76.9839 0.843018 77.783 0.843018C78.5821 0.843018 79.359 1.10583 79.994 1.59095C80.444 1.93595 80.802 2.37395 81.056 2.86995C81.3092 3.36976 81.4398 3.92266 81.437 4.48295H81.425Z" fill="url(#paint0_linear_7_126)"/>
                  <path d="M80.306 48.6029C79.879 48.6029 79.463 48.4649 79.106 48.1999L70.92 41.9869C70.8167 41.9087 70.7328 41.8078 70.6747 41.6919C70.6167 41.5761 70.586 41.4485 70.585 41.3189V18.8899C70.5859 18.838 70.5724 18.7868 70.5459 18.7422C70.5194 18.6975 70.481 18.661 70.435 18.6369C70.3886 18.6098 70.335 18.5974 70.2814 18.6015C70.2278 18.6056 70.1767 18.626 70.135 18.6599L55.681 29.6439C55.5332 29.7562 55.3526 29.817 55.167 29.817C54.9814 29.817 54.8008 29.7562 54.653 29.6439L46.837 23.7079C46.7337 23.6297 46.6498 23.5288 46.5917 23.4129C46.5337 23.2971 46.503 23.1695 46.502 23.0399C46.5016 22.91 46.5317 22.7818 46.5898 22.6656C46.648 22.5494 46.7327 22.4484 46.837 22.3709L75.053 0.921944C75.837 0.327415 76.794 0.00561523 77.778 0.00561523C78.762 0.00561523 79.7189 0.327415 80.503 0.921944C81.0528 1.34195 81.4989 1.88248 81.807 2.50194C82.119 3.11194 82.269 3.80294 82.269 4.49494V46.6319C82.269 47.3819 81.853 48.0619 81.172 48.3959C80.8997 48.532 80.5994 48.6029 80.295 48.6029H80.306ZM72.282 40.8809L80.132 46.8399C80.1738 46.8741 80.2251 46.8946 80.2789 46.8987C80.3327 46.9028 80.3865 46.8903 80.433 46.8629C80.4807 46.8407 80.5206 46.8045 80.5473 46.7592C80.5741 46.7138 80.5865 46.6615 80.583 46.6089V4.48294C80.583 4.04494 80.479 3.61894 80.295 3.23894C80.0978 2.85237 79.8178 2.51401 79.475 2.24794C78.9844 1.88316 78.3893 1.68616 77.778 1.68616C77.1667 1.68616 76.5716 1.88316 76.081 2.24794L48.742 23.0049L55.162 27.8799L69.119 17.2879C69.4146 17.0684 69.7652 16.935 70.132 16.9025C70.4988 16.87 70.8674 16.9398 71.197 17.1039C71.5242 17.2674 71.7992 17.5192 71.9909 17.8307C72.1827 18.1422 72.2835 18.5012 72.282 18.8669V40.8809Z" fill="white"/>
                  <path d="M71.428 18.8669V29.1129L63.404 35.2109L55.161 28.9519L69.627 17.9679C70.377 17.4149 71.428 17.9439 71.428 18.8669Z" fill="url(#paint1_linear_7_126)"/>
                  <path d="M63.404 36.0519C63.2201 36.0529 63.0411 35.9919 62.896 35.8789L54.653 29.6209C54.5496 29.5426 54.4656 29.4415 54.4075 29.3255C54.3494 29.2095 54.3188 29.0817 54.318 28.9519C54.3177 28.8221 54.3479 28.6941 54.4061 28.5781C54.4642 28.4621 54.5488 28.3613 54.653 28.2839L69.12 17.2999C69.4155 17.0802 69.7661 16.9466 70.1329 16.914C70.4997 16.8813 70.8683 16.9509 71.198 17.1149C71.5254 17.2785 71.8005 17.5304 71.9922 17.8421C72.1839 18.1538 72.2847 18.513 72.283 18.8789V29.1249C72.2823 29.2546 72.2518 29.3823 72.1939 29.4983C72.136 29.6143 72.0522 29.7155 71.949 29.7939L63.925 35.8909C63.7788 36.0019 63.6005 36.0623 63.417 36.0629L63.404 36.0519ZM56.57 28.9519L63.416 34.1499L70.596 28.6989V18.8789C70.5971 18.8268 70.5837 18.7754 70.5572 18.7306C70.5307 18.6857 70.4922 18.6491 70.446 18.6249C70.3996 18.5978 70.346 18.5854 70.2924 18.5895C70.2388 18.5936 70.1877 18.614 70.146 18.6479L56.582 28.9519H56.57Z" fill="white"/>
                  <path d="M91.552 14.8449V60.8999C91.5505 61.5954 91.3895 62.2812 91.0812 62.9047C90.773 63.5281 90.3257 64.0725 89.774 64.4959L89.508 64.6919C88.722 65.2917 87.7607 65.6166 86.772 65.6166C85.7833 65.6166 84.822 65.2917 84.036 64.6919L24.626 19.5699C24.626 19.5699 24.602 19.5589 24.591 19.5469C23.851 19.0289 22.813 19.5469 22.813 20.4689V41.6649L13.877 48.4529C13.709 48.5783 13.5093 48.6543 13.3005 48.6724C13.0916 48.6906 12.8818 48.6501 12.6947 48.5555C12.5076 48.461 12.3506 48.3161 12.2413 48.1372C12.132 47.9584 12.0747 47.7525 12.076 47.5429V5.65888C12.076 4.25288 12.734 2.92788 13.866 2.07488L14.096 1.90188C14.8821 1.30185 15.8436 0.976807 16.8325 0.976807C17.8214 0.976807 18.7829 1.30185 19.569 1.90188L47.38 23.0279L55.196 28.9639L63.44 35.2219L71.463 41.3189L79.649 47.5309C80.399 48.0959 81.461 47.5659 81.461 46.6319V4.48288C81.461 3.91888 81.334 3.36588 81.081 2.86988C80.8261 2.3696 80.463 1.93235 80.018 1.58988L81.461 2.68588L88.019 7.66488C89.1263 8.5062 90.0243 9.59189 90.643 10.8373C91.2617 12.0827 91.5845 13.4542 91.586 14.8449H91.552Z" fill="url(#paint2_linear_7_126)"/>
                  <path d="M86.782 66.456C85.6068 66.4547 84.464 66.0702 83.527 65.361L24.163 20.273C24.163 20.273 24.116 20.25 24.105 20.239C24.0633 20.2088 24.0137 20.1916 23.9623 20.1895C23.9109 20.1873 23.86 20.2004 23.816 20.2269C23.758 20.2619 23.666 20.331 23.666 20.469V41.665C23.665 41.7945 23.6343 41.9221 23.5763 42.0379C23.5182 42.1538 23.4343 42.2547 23.331 42.333L14.395 49.122C14.395 49.122 14.349 49.1559 14.326 49.1679C14.0337 49.3726 13.6912 49.4937 13.3352 49.518C12.9792 49.5423 12.6234 49.469 12.306 49.306C11.9788 49.1424 11.7038 48.8907 11.5121 48.5792C11.3203 48.2677 11.2195 47.9087 11.221 47.5429V5.65895C11.221 3.99895 12.017 2.40895 13.345 1.40595L13.565 1.23295C14.4987 0.521142 15.6404 0.13562 16.8145 0.13562C17.9886 0.13562 19.1303 0.521142 20.064 1.23295L80.144 46.8629C80.1857 46.8969 80.2368 46.9173 80.2904 46.9214C80.344 46.9255 80.3976 46.9131 80.444 46.886C80.4916 46.8636 80.5314 46.8274 80.5581 46.7821C80.5849 46.7368 80.5974 46.6845 80.594 46.632V4.48295C80.594 4.04495 80.49 3.61895 80.306 3.23895C80.109 2.85196 79.829 2.51324 79.486 2.24695C79.398 2.17902 79.3243 2.09438 79.2691 1.99788C79.2139 1.90138 79.1783 1.79492 79.1643 1.68462C79.1504 1.57432 79.1584 1.46236 79.1878 1.35516C79.2173 1.24796 79.2677 1.14764 79.336 1.05995C79.4742 0.883203 79.6759 0.767441 79.8982 0.737363C80.1206 0.707285 80.3458 0.765271 80.526 0.898951L88.526 6.98395C90.962 8.83995 92.428 11.768 92.428 14.834V60.889C92.4296 61.7148 92.2396 62.5298 91.873 63.2699C91.5063 64.0099 90.973 64.6549 90.315 65.154L90.038 65.361C89.1059 66.0703 87.9653 66.4514 86.794 66.445L86.782 66.456ZM25.145 18.8899L84.555 64.013C85.1955 64.4954 85.9756 64.7563 86.7775 64.7563C87.5794 64.7563 88.3595 64.4954 89 64.013L89.277 63.805C89.7269 63.4639 90.0915 63.0229 90.3419 62.5169C90.5923 62.0108 90.7217 61.4536 90.72 60.889V14.845C90.7154 13.5863 90.4216 12.3455 89.8612 11.2184C89.3008 10.0914 88.4888 9.10825 87.488 8.34495L82.28 4.38995V46.631C82.28 47.381 81.864 48.061 81.183 48.395C80.8531 48.5605 80.4833 48.63 80.1159 48.5953C79.7484 48.5606 79.3981 48.4233 79.105 48.199L19.025 2.55895C18.3845 2.0765 17.6044 1.81557 16.8025 1.81557C16.0006 1.81557 15.2205 2.0765 14.58 2.55895L14.36 2.73195C13.9105 3.07416 13.5456 3.51508 13.2935 4.02067C13.0414 4.52625 12.9088 5.083 12.906 5.64795V47.5429C12.906 47.6929 12.998 47.773 13.056 47.796C13.114 47.831 13.229 47.8659 13.345 47.7729C13.356 47.7729 13.379 47.7499 13.391 47.7389L21.957 41.227V20.447C21.9561 20.084 22.0561 19.7279 22.2457 19.4183C22.4354 19.1088 22.7072 18.858 23.031 18.694C23.3452 18.5304 23.6978 18.4548 24.0515 18.4753C24.4051 18.4957 24.7467 18.6113 25.04 18.8099L25.144 18.879V18.8899H25.145Z" fill="white"/>
                  <path d="M89.507 64.6929L86.771 66.7669L83.896 68.9459C82.3239 70.1404 80.4039 70.787 78.4295 70.787C76.4551 70.787 74.5351 70.1404 72.963 68.9459L45.971 48.4419L37.728 42.1839L29.912 36.2479L22.8 30.8539V20.4579C22.8 19.5479 23.84 19.0179 24.578 19.5359L84.035 64.6799C84.821 65.2797 85.7823 65.6046 86.771 65.6046C87.7597 65.6046 88.721 65.2797 89.507 64.6799V64.6929Z" fill="url(#paint3_linear_7_126)"/>
                  <path d="M78.436 71.631C76.2772 71.6336 74.1769 70.9294 72.456 69.626L22.291 31.534C22.1876 31.4556 22.1036 31.3545 22.0455 31.2385C21.9874 31.1225 21.9568 30.9947 21.956 30.865V20.47C21.9553 20.1071 22.0554 19.7513 22.245 19.4419C22.4346 19.1326 22.7064 18.882 23.03 18.718C23.3501 18.5492 23.7107 18.4729 24.0717 18.4974C24.4327 18.522 24.7797 18.6465 25.074 18.857L84.554 64.025C85.1944 64.5072 85.9743 64.768 86.776 64.768C87.5777 64.768 88.3576 64.5072 88.998 64.025C89.1774 63.8889 89.4034 63.8295 89.6265 63.8598C89.8496 63.8902 90.0516 64.0079 90.188 64.187C90.2554 64.2755 90.3048 64.3765 90.3331 64.4841C90.3615 64.5917 90.3683 64.7038 90.3533 64.8141C90.3382 64.9244 90.3016 65.0306 90.2454 65.1266C90.1893 65.2227 90.1147 65.3068 90.026 65.374L84.426 69.627C82.7052 70.9305 80.6048 71.6347 78.446 71.632H78.435L78.436 71.631ZM23.654 30.44L73.471 68.278C76.392 70.491 80.467 70.491 83.377 68.278L85.882 66.377C85.0265 66.234 84.2184 65.8857 83.527 65.362L24.07 20.216C23.978 20.146 23.862 20.181 23.805 20.216C23.747 20.25 23.655 20.32 23.655 20.458V30.438L23.654 30.44Z" fill="white"/>
                  <path d="M45.97 48.4529L18.495 69.3259C16.9229 70.5204 15.0029 71.167 13.0285 71.167C11.0541 71.167 9.13409 70.5204 7.562 69.3259L4.778 67.2299L2.4 65.4179C3.08543 65.9339 3.92008 66.2129 4.778 66.2129C5.63592 66.2129 6.47057 65.9339 7.156 65.4179L37.728 42.2059L45.971 48.4639V48.4519L45.97 48.4529Z" fill="url(#paint4_linear_7_126)"/>
                  <path d="M13.021 71.9999C10.8619 72.0045 8.76098 71.3001 7.041 69.9949L1.891 66.0879C1.71432 65.9501 1.59864 65.7486 1.56873 65.5265C1.53883 65.3045 1.59707 65.0795 1.731 64.8999C1.86911 64.7237 2.07049 64.6083 2.29232 64.5783C2.51416 64.5482 2.73897 64.6058 2.919 64.7389C3.4587 65.143 4.11478 65.3614 4.789 65.3614C5.46322 65.3614 6.1193 65.143 6.659 64.7389L37.231 41.5269C37.3788 41.4149 37.5591 41.3542 37.7445 41.3542C37.9299 41.3542 38.1102 41.4149 38.258 41.5269L46.502 47.7849C46.6051 47.7632 46.6888 47.9642 46.7467 48.08C46.8046 48.1958 46.8352 48.3234 46.836 48.4529C46.8365 48.5828 46.8066 48.7109 46.7486 48.8271C46.6906 48.9433 46.6061 49.0443 46.502 49.1219L19.024 69.9949C17.304 71.3001 15.2031 72.0045 13.044 71.9999H13.021ZM5.805 66.9399L8.057 68.6459C9.48571 69.723 11.2263 70.3055 13.0155 70.3055C14.8047 70.3055 16.5453 69.723 17.974 68.6459L44.562 48.4419L37.727 43.2439L7.676 66.0879C7.11 66.5139 6.476 66.8019 5.817 66.9399H5.806H5.805Z" fill="white"/>
                  <path d="M37.728 42.195L7.158 65.4069C6.47248 65.9232 5.63764 66.2023 4.7795 66.2023C3.92136 66.2023 3.08652 65.9232 2.401 65.4069C1.91453 65.0444 1.52248 64.57 1.258 64.024C0.986516 63.484 0.844111 62.8883 0.842 62.284V16.401C0.84094 15.0098 1.16251 13.6375 1.78143 12.3916C2.40036 11.1458 3.29978 10.0605 4.409 9.22095L12.052 3.42295L13.842 2.07495C13.2881 2.49443 12.8384 3.03604 12.5279 3.65765C12.2175 4.27927 12.0546 4.96413 12.052 5.65895V47.554C12.052 48.488 13.102 49.018 13.853 48.464L22.789 41.6759L29.901 36.271L37.717 42.207L37.728 42.195Z" fill="url(#paint5_linear_7_126)"/>
                </g>
                <defs>
                  <linearGradient id="paint0_linear_7_126" x1="90.004" y1="30.0699" x2="16.53" y2="-9.94704" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FDA052"/>
                    <stop offset="0.37" stopColor="#B96AF7"/>
                    <stop offset="0.44" stopColor="#916DF5"/>
                    <stop offset="0.55" stopColor="#5D72F4"/>
                    <stop offset="0.63" stopColor="#3C75F3"/>
                    <stop offset="0.67" stopColor="#3077F3"/>
                    <stop offset="0.72" stopColor="#3180F3"/>
                    <stop offset="0.81" stopColor="#3599F4"/>
                    <stop offset="0.92" stopColor="#3BC1F6"/>
                    <stop offset="1" stopColor="#41E6F8"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_7_126" x1="43.847" y1="50.0439" x2="73.302" y2="18.1149" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FDA052"/>
                    <stop offset="0.37" stopColor="#B96AF7"/>
                    <stop offset="0.44" stopColor="#916DF5"/>
                    <stop offset="0.55" stopColor="#5D72F4"/>
                    <stop offset="0.63" stopColor="#3C75F3"/>
                    <stop offset="0.67" stopColor="#3077F3"/>
                    <stop offset="0.72" stopColor="#3180F3"/>
                    <stop offset="0.81" stopColor="#3599F4"/>
                    <stop offset="0.92" stopColor="#3BC1F6"/>
                    <stop offset="1" stopColor="#41E6F8"/>
                  </linearGradient>
                  <linearGradient id="paint2_linear_7_126" x1="14.616" y1="52.0259" x2="94.06" y2="11.8669" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FDA052"/>
                    <stop offset="0.37" stopColor="#B96AF7"/>
                    <stop offset="0.44" stopColor="#916DF5"/>
                    <stop offset="0.55" stopColor="#5D72F4"/>
                    <stop offset="0.63" stopColor="#3C75F3"/>
                    <stop offset="0.67" stopColor="#3077F3"/>
                    <stop offset="0.72" stopColor="#3180F3"/>
                    <stop offset="0.81" stopColor="#3599F4"/>
                    <stop offset="0.92" stopColor="#3BC1F6"/>
                    <stop offset="1" stopColor="#41E6F8"/>
                  </linearGradient>
                  <linearGradient id="paint3_linear_7_126" x1="86.505" y1="70.6509" x2="18.435" y2="20.9939" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FDA052"/>
                    <stop offset="0.37" stopColor="#B96AF7"/>
                    <stop offset="0.44" stopColor="#916DF5"/>
                    <stop offset="0.55" stopColor="#5D72F4"/>
                    <stop offset="0.63" stopColor="#3C75F3"/>
                    <stop offset="0.67" stopColor="#3077F3"/>
                    <stop offset="0.72" stopColor="#3180F3"/>
                    <stop offset="0.81" stopColor="#3599F4"/>
                    <stop offset="0.92" stopColor="#3BC1F6"/>
                    <stop offset="1" stopColor="#41E6F8"/>
                  </linearGradient>
                  <linearGradient id="paint4_linear_7_126" x1="3.728" y1="72.1729" x2="69.655" y2="24.9169" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FDA052"/>
                    <stop offset="0.37" stopColor="#B96AF7"/>
                    <stop offset="0.44" stopColor="#916DF5"/>
                    <stop offset="0.55" stopColor="#5D72F4"/>
                    <stop offset="0.63" stopColor="#3C75F3"/>
                    <stop offset="0.67" stopColor="#3077F3"/>
                    <stop offset="0.72" stopColor="#3180F3"/>
                    <stop offset="0.81" stopColor="#3599F4"/>
                    <stop offset="0.92" stopColor="#3BC1F6"/>
                    <stop offset="1" stopColor="#41E6F8"/>
                  </linearGradient>
                  <linearGradient id="paint5_linear_7_126" x1="56.593" y1="8.42495" x2="-14.988" y2="47.9099" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FDA052"/>
                    <stop offset="0.37" stopColor="#B96AF7"/>
                    <stop offset="0.44" stopColor="#916DF5"/>
                    <stop offset="0.55" stopColor="#5D72F4"/>
                    <stop offset="0.63" stopColor="#3C75F3"/>
                    <stop offset="0.67" stopColor="#3077F3"/>
                    <stop offset="0.72" stopColor="#3180F3"/>
                    <stop offset="0.81" stopColor="#3599F4"/>
                    <stop offset="0.92" stopColor="#3BC1F6"/>
                    <stop offset="1" stopColor="#41E6F8"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-fade-in-up">
            Magure.AI
          </h1>
          <p className="text-gray-600 text-sm animate-fade-in-up stagger-1">
            {message}
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex space-x-2 animate-fade-in-up stagger-2">
          <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full loading-dot"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full loading-dot"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full loading-dot"></div>
        </div>
      </div>

      {/* Additional Premium Effects */}
      {fullScreen && (
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 pointer-events-none"></div>
      )}
    </div>
  );
};

export default LoadingScreen; 