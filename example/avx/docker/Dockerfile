FROM debian:bookworm-slim
RUN apt-get update -y --fix-missing
RUN apt-get install -y curl make g++ autoconf libtool unzip xz-utils golang dmidecode python3

WORKDIR /bench

# hyperfine
ARG HYPERFINE_VERSION=1.18.0
RUN curl -L -o hyperfine_${HYPERFINE_VERSION}_amd64.deb https://github.com/sharkdp/hyperfine/releases/download/v${HYPERFINE_VERSION}/hyperfine_${HYPERFINE_VERSION}_amd64.deb
RUN dpkg -i hyperfine_${HYPERFINE_VERSION}_amd64.deb
RUN rm hyperfine_${HYPERFINE_VERSION}_amd64.deb

# poop
ARG POOP_VERSION=0.4.0
RUN curl -L -o poop https://github.com/andrewrk/poop/releases/download/${POOP_VERSION}/x86_64-linux-poop
RUN mv poop /usr/local/bin/

# node.js
ARG NODE_VERSION=22.2.0
RUN curl -L -o nodejs.tar.xz https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz
RUN tar -xvf nodejs.tar.xz
RUN mv node-v${NODE_VERSION}-linux-x64 /root/.node
ENV NODE_ENV=production
RUN rm nodejs.tar.xz

# bun
RUN /bin/bash -o pipefail -c "$(curl -fsSL https://bun.sh/install)"

# deno
RUN /bin/bash -o pipefail -c "$(curl -fsSL https://deno.land/install.sh)"

# lo
ARG LO_VERSION=0.0.16-pre
RUN curl -L -o ${LO_VERSION}.tar.gz https://github.com/just-js/lo/archive/refs/tags/${LO_VERSION}.tar.gz
RUN tar -xf ${LO_VERSION}.tar.gz
RUN mv lo-${LO_VERSION} /root/.lo
RUN rm ${LO_VERSION}.tar.gz
RUN curl -L -o lo-linux-x64.gz https://github.com/just-js/lo/releases/download/${LO_VERSION}/lo-linux-x64.gz
RUN gunzip lo-linux-x64.gz
RUN chmod +x lo-linux-x64
RUN ./lo-linux-x64 install
RUN rm lo-linux-x64

# fix permissions for root
RUN chown -R root:root /root/.deno/
RUN chown -R root:root /root/.node/
RUN chown -R root:root /root/.bun/
RUN chmod +x /usr/local/bin/poop

# add paths to installed apps
ENV LO_HOME="/root/.lo"
ENV PATH="/root/.node/bin:/root/.bun/bin:/root/.lo/bin:/root/.deno/bin:$PATH" 

CMD ["/bin/bash"]
